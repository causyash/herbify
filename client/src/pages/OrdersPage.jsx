import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../lib/api'

export function OrdersPage() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      try {
        setError('')
        setBusy(true)
        const res = await api.get('/api/orders/my')
        if (!active) return
        setItems(res.data.items || [])
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load orders')
      } finally {
        if (active) setBusy(false)
      }
    })()
    return () => {
      active = false
    }
  }, [user])

  if (!loading && !user) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        My orders
      </h1>
      <p className="mt-1 text-slate-600">Track your order and payment status.</p>

      {busy ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading orders…
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          No orders yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {items.map((o) => (
            <Link
              key={o._id}
              to={`/account/orders/${o._id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">Order {o._id}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Status: {o.orderStatus} • Payment: {o.paymentStatus}
                  </p>
                </div>
                <p className="shrink-0 font-semibold text-slate-900">₹ {o.total}</p>
              </div>
              <p className="mt-3 text-sm text-slate-700">
                Items: {o.items?.length || 0}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

