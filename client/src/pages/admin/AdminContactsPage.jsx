import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export function AdminContactsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    const res = await api.get('/api/admin/contacts')
    setItems(res.data.items || [])
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        await load()
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load contacts')
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
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Contact messages
      </h1>
      <p className="mt-2 text-slate-600">Review and close messages.</p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-900">Inbox</p>
          {loading ? <p className="text-sm text-slate-600">Loading…</p> : null}
        </div>

        <div className="mt-4 grid gap-3">
          {items.map((m) => (
            <div
              key={m._id}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {m.name}{' '}
                    <span className="text-sm font-medium text-slate-500">
                      ({m.email})
                    </span>
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                    Status: {m.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await api.patch(`/api/admin/contacts/${m._id}/status`, {
                          status: m.status === 'closed' ? 'new' : 'closed',
                        })
                        await load()
                      } catch (err) {
                        setError(err?.response?.data?.message || 'Update failed')
                      }
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Mark {m.status === 'closed' ? 'new' : 'closed'}
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
                {m.message}
              </p>
            </div>
          ))}
          {!loading && items.length === 0 ? (
            <p className="text-sm text-slate-600">No messages yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

