/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../lib/api'

const CartContext = createContext(null)
const LS_KEY = 'herbify_cart_v1'

function readLocalCart() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalCart(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

function keyOf(item) {
  return `${item.itemType}:${item.slug}`
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState(() => readLocalCart())
  const [syncing, setSyncing] = useState(false)
  const [lastSyncedJson, setLastSyncedJson] = useState('')

  useEffect(() => {
    writeLocalCart(items)
  }, [items])

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    let active = true
    ;(async () => {
      setSyncing(true)
      try {
        const serverRes = await api.get('/api/cart')
        const serverItems = serverRes.data.items || []

        const map = new Map()
        for (const it of serverItems) map.set(keyOf(it), { ...it })
        for (const it of items) {
          const k = keyOf(it)
          const prev = map.get(k)
          map.set(k, prev ? { ...prev, qty: prev.qty + it.qty } : { ...it })
        }

        const merged = Array.from(map.values()).map((it) => ({
          ...it,
          qty: Math.min(99, Math.max(1, it.qty)),
        }))

        if (!active) return
        setItems(merged)
        await api.put('/api/cart', { items: merged })
        setLastSyncedJson(JSON.stringify(merged))
      } catch {
        // non-blocking: keep local cart if sync fails
      } finally {
        if (active) setSyncing(false)
      }
    })()

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id])

  useEffect(() => {
    if (authLoading) return
    if (!user) return

    const json = JSON.stringify(items)
    if (json === lastSyncedJson) return

    const t = setTimeout(async () => {
      try {
        await api.put('/api/cart', { items })
        setLastSyncedJson(JSON.stringify(items))
      } catch {
        // ignore
      }
    }, 500)

    return () => clearTimeout(t)
  }, [authLoading, user, items, lastSyncedJson])

  function addItem(next) {
    setItems((prev) => {
      const idx = prev.findIndex((p) => keyOf(p) === keyOf(next))
      if (idx === -1) return [...prev, { ...next, qty: Math.min(99, next.qty || 1) }]
      const updated = [...prev]
      updated[idx] = { ...updated[idx], qty: Math.min(99, updated[idx].qty + (next.qty || 1)) }
      return updated
    })
  }

  function removeItem(itemType, slug) {
    setItems((prev) => prev.filter((p) => !(p.itemType === itemType && p.slug === slug)))
  }

  function setQty(itemType, slug, qty) {
    setItems((prev) =>
      prev.map((p) =>
        p.itemType === itemType && p.slug === slug
          ? { ...p, qty: Math.min(99, Math.max(1, qty)) }
          : p
      )
    )
  }

  function clear() {
    setItems([])
  }

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 0), 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      syncing,
      subtotal,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [items, syncing, subtotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

