import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartProvider.jsx'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

function flattenCategories(nodes, prefix = '') {
  const out = []
  for (const n of nodes || []) {
    const label = prefix ? `${prefix} / ${n.name}` : n.name
    out.push({ slug: n.slug, name: n.name, label })
    if (n.children?.length) out.push(...flattenCategories(n.children, label))
  }
  return out
}

export function ProductsListPage() {
  const { addItem } = useCart()
  const [items, setItems] = useState([])
  const [categoriesTree, setCategoriesTree] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = useMemo(
    () => flattenCategories(categoriesTree),
    [categoriesTree]
  )

  async function loadProducts(nextCategory) {
    const res = await api.get('/api/products', {
      params: { limit: 24, category: nextCategory || undefined },
    })
    setItems(res.data.items || [])
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const [catsRes] = await Promise.all([api.get('/api/categories')])
        if (!active) return
        setCategoriesTree(catsRes.data.categories || [])
        await loadProducts('')
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load products')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-slate-600">Shop categories and subcategories.</p>
        </div>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Category
          </span>
          <select
            value={category}
            onChange={async (e) => {
              const next = e.target.value
              setCategory(next)
              setLoading(true)
              try {
                await loadProducts(next)
              } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load products')
              } finally {
                setLoading(false)
              }
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2 sm:w-64"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading products…
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          No products found.
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Link to={`/products/${p.slug}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100" />
                )}
                {p.stock < 10 && p.stock > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Low Stock
                  </span>
                )}
                {p.stock === 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Sold Out
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-6">
                 <Link to={`/products/${p.slug}`}>
                    <h4 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-emerald-600 transition">{p.name}</h4>
                 </Link>
                 <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-emerald-600">₹ {p.price}</p>
                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          itemType: 'product',
                          itemId: p._id,
                          slug: p.slug,
                          name: p.name,
                          price: p.price,
                          image: p.images?.[0] || '',
                          qty: 1,
                        })
                        toast.success('Added to cart')
                      }}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      Add +
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

