import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { uploadToCloudinary } from '../../admin/cloudinary'
import { io } from 'socket.io-client'

function splitLines(v) {
  return String(v || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function AdminHerbsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [usesText, setUsesText] = useState('')
  const [benefitsText, setBenefitsText] = useState('')
  const [price, setPrice] = useState(199)
  const [stock, setStock] = useState(0)
  const [imageUrls, setImageUrls] = useState([])
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function load() {
    const res = await api.get('/api/admin/herbs')
    setItems(res.data.items || [])
  }

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          setError('')
          setLoading(true)
          await load()
        } catch (err) {
          if (!active) return
          setError(err?.response?.data?.message || 'Failed to load herbs')
        } finally {
          if (active) setLoading(false)
        }
      })()

    // Socket for live stock updates
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const socket = io(socketUrl, { withCredentials: true })
    socket.on('stock-update', (data) => {
      if (data.itemType === 'herb') {
        setItems((prev) =>
          prev.map((item) =>
            item._id === data.itemId ? { ...item, stock: data.newStock } : item
          )
        )
      }
    })

    return () => {
      active = false
      socket.disconnect()
    }

  }, [])

  async function onUpload(files) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    try {
      const sig = await api.post('/api/uploads/signature', { folder: 'herbify/herbs' })
      const newUrls = []
      for (const file of files) {
        const uploaded = await uploadToCloudinary({ file, signatureData: sig.data })
        newUrls.push(uploaded.secure_url || uploaded.url || '')
      }
      setImageUrls((prev) => [...prev, ...newUrls])
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const payload = {
        name,
        slug: slug || undefined,
        shortDescription,
        description,
        uses: splitLines(usesText),
        benefits: splitLines(benefitsText),
        price: Number(price),
        stock: Number(stock),
        images: imageUrls,
      }
      if (editingId) await api.put(`/api/admin/herbs/${editingId}`, payload)
      else await api.post('/api/admin/herbs', payload)
      await load()
      onCancel()
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  function onEdit(it) {
    setEditingId(String(it._id))
    setName(it.name || '')
    setSlug(it.slug || '')
    setShortDescription(it.shortDescription || '')
    setDescription(it.description || '')
    setUsesText((it.uses || []).join('\n'))
    setBenefitsText((it.benefits || []).join('\n'))
    setPrice(it.price || 0)
    setStock(it.stock || 0)
    setImageUrls(it.images || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function onCancel() {
    setEditingId(null)
    setName('')
    setSlug('')
    setShortDescription('')
    setDescription('')
    setUsesText('')
    setBenefitsText('')
    setPrice(199)
    setStock(0)
    setImageUrls([])
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Herbs
      </h1>
      <p className="mt-2 text-slate-600">Create and manage herb profiles.</p>

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
          <span className="text-sm font-medium text-slate-800">
            Short description
          </span>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-800">Description</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">
              Uses (one per line)
            </span>
            <textarea
              rows={4}
              value={usesText}
              onChange={(e) => setUsesText(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">
              Benefits (one per line)
            </span>
            <textarea
              rows={4}
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Price</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-800">Stock</span>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium text-slate-800">Images</span>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length > 0) onUpload(files)
              }}
              disabled={uploading}
            />
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, idx) => (
                <div key={url + idx} className="group relative">
                  <img
                    src={url}
                    alt=""
                    className="size-14 rounded-xl object-cover bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute -right-1 -top-1 hidden rounded-full bg-red-500 p-0.5 text-white shadow-sm group-hover:block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          {uploading ? (
            <p className="text-sm text-slate-600">Uploading…</p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy || uploading}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {editingId ? 'Update herb' : 'Create herb'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={onCancel}
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
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Stock</th>
                <th className="py-2 pr-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {items.map((h) => (
                <tr key={h._id} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">{h.name}</td>
                  <td className="py-3 pr-4 text-slate-700">{h.slug}</td>
                  <td className="py-3 pr-4 text-slate-700">₹ {h.price}</td>
                  <td className="py-3 pr-4 text-slate-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${h.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                      {h.stock}
                    </span>
                  </td>
                  <td className="py-3 pr-0">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(h)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm('Delete this herb?')) return
                          try {
                            await api.delete(`/api/admin/herbs/${h._id}`)
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
                  <td className="py-3 text-slate-600" colSpan={5}>
                    No herbs yet.
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

