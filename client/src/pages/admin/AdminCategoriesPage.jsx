import { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'

function flatten(nodes, prefix = '') {
  const out = []
  for (const n of nodes || []) {
    const label = prefix ? `${prefix} / ${n.name}` : n.name
    out.push({ ...n, label })
    if (n.children?.length) out.push(...flatten(n.children, label))
  }
  return out
}

export function AdminCategoriesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    const res = await api.get('/api/admin/categories')
    setItems(res.data.items || [])
  }

  const flatForParent = useMemo(() => {
    const byId = new Map(items.map((c) => [String(c._id), { ...c, children: [] }]))
    const roots = []
    for (const c of items) {
      const node = byId.get(String(c._id))
      if (c.parentId) {
        const p = byId.get(String(c.parentId))
        if (p) p.children.push(node)
        else roots.push(node)
      } else roots.push(node)
    }
    return flatten(roots)
  }, [items])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        await load()
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load categories')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
     
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const payload = { name, slug: slug || undefined, parentId: parentId || null }
      if (editingId) await api.put(`/api/admin/categories/${editingId}`, payload)
      else await api.post('/api/admin/categories', payload)
      await load()
      setEditingId(null)
      setName('')
      setSlug('')
      setParentId('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Categories
      </h1>
      <p className="mt-2 text-slate-600">Create categories and subcategories.</p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Slug (optional)</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
              placeholder="auto-generated if empty"
            />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-800">Parent (optional)</span>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2"
          >
            <option value="">None (top-level)</option>
            {flatForParent.map((c) => (
              <option key={c._id} value={c._id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {editingId ? 'Update category' : 'Create category'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setName('')
                setSlug('')
                setParentId('')
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-900">Existing</p>
          {loading ? <p className="text-sm text-slate-600">Loading…</p> : null}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Slug</th>
                <th className="py-2 pr-4">Parent</th>
                <th className="py-2 pr-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {items.map((c) => (
                <tr key={c._id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">{c.name}</td>
                  <td className="py-3 pr-4 text-slate-700">{c.slug}</td>
                  <td className="py-3 pr-4 text-slate-700">
                    {c.parentId ? String(c.parentId) : '—'}
                  </td>
                  <td className="py-3 pr-0">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(String(c._id))
                          setName(c.name || '')
                          setSlug(c.slug || '')
                          setParentId(c.parentId ? String(c.parentId) : '')
                        }}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm('Delete this category?')) return
                          try {
                            await api.delete(`/api/admin/categories/${c._id}`)
                            await load()
                          } catch (err) {
                            setError(err?.response?.data?.message || 'Delete failed')
                          }
                        }}
                        className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 ? (
                <tr>
                  <td className="py-3 text-slate-600" colSpan={4}>
                    No categories yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

