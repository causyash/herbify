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
    <div className="mx-auto max-w-6xl px-4 py-10">
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((h) => (
            <div
              key={h.slug}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {h.images?.[0] ? (
                <img
                  src={h.images[0]}
                  alt={h.name}
                  className="aspect-[16/10] w-full rounded-xl object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[16/10] w-full rounded-xl bg-slate-100" />
              )}
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{h.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {h.shortDescription}
                  </p>
                </div>
                <p className="shrink-0 text-base font-semibold text-slate-900">
                  ₹ {h.price}
                </p>
              </div>
              <Link
                to={`/herbs/${h.slug}`}
                className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

