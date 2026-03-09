import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export function HerbsListPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const res = await api.get('/api/herbs', { params: { limit: 24 } })
        if (!active) return
        setItems(res.data.items || [])
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load herbs')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Herbs
          </h1>
          <p className="mt-1 text-slate-600">
            Browse medicinal herbs and learn about their uses and benefits.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading herbs…
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          No herbs found.
        </div>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((h) => (
            <Link
              key={h.slug}
              to={`/herbs/${h.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                {h.images?.[0] ? (
                  <img
                    src={h.images[0]}
                    alt={h.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-slate-100" />
                )}
                 <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 shadow-sm">
                    Raw Herb Base
                 </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition">{h.name}</h4>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {h.shortDescription}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                   <p className="text-xl font-bold text-emerald-600">₹ {h.price}</p>
                   <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition">Explore &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

