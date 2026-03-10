import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

export function AddressesSection() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingIdx, setEditingIdx] = useState(-1)
  const [isAdding, setIsAdding] = useState(false)
  
  const [form, setForm] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  async function loadAddresses() {
    setLoading(true)
    try {
      const res = await api.get('/api/auth/me')
      setAddresses(res.data.user?.addresses || [])
    } catch {
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  async function saveAddresses(newAddresses) {
    try {
      const res = await api.put('/api/users/me/addresses', { addresses: newAddresses })
      setAddresses(res.data.addresses)
      toast.success('Addresses updated')
      setEditingIdx(-1)
      setIsAdding(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save address')
    }
  }

  function handleSave(e) {
    e.preventDefault()
    let newList = [...addresses]
    if (editingIdx >= 0) {
      // update
      newList[editingIdx] = form
    } else {
      // add
      newList.push(form)
    }
    saveAddresses(newList)
  }

  function handleDelete(idx) {
    if (!confirm('Are you sure you want to delete this address?')) return
    let newList = [...addresses]
    newList.splice(idx, 1)
    saveAddresses(newList)
  }

  function openEdit(idx) {
    setForm(addresses[idx])
    setEditingIdx(idx)
    setIsAdding(false)
  }

  function openAdd() {
    setForm({
      label: 'Home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    })
    setEditingIdx(-1)
    setIsAdding(true)
  }

  function cancel() {
    setEditingIdx(-1)
    setIsAdding(false)
  }

  if (loading) return <div className="p-4 text-slate-500">Loading addresses...</div>

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Saved Addresses</h2>
        {(!isAdding && editingIdx === -1) && (
          <button onClick={openAdd} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            + Add New
          </button>
        )}
      </div>

      {(isAdding || editingIdx >= 0) ? (
        <form onSubmit={handleSave} className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Label (e.g. Home, Work)</span>
            <input required type="text" value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" placeholder="Home, Work, Other..." />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Full Name</span>
            <input required type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Phone</span>
            <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Address Line 1</span>
            <input required type="text" value={form.addressLine1} onChange={e => setForm({...form, addressLine1: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Address Line 2 (Optional)</span>
            <input type="text" value={form.addressLine2} onChange={e => setForm({...form, addressLine2: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">City</span>
            <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">State</span>
            <input required type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Pincode</span>
            <input required type="text" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring-2" />
          </label>
          <div className="sm:col-span-2 mt-4 flex gap-4">
            <button type="submit" className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600">
              Save Address
            </button>
            <button type="button" onClick={cancel} className="rounded-xl bg-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="mt-6 text-center text-sm text-slate-600 py-6 border border-dashed border-slate-300 rounded-xl">
          No addresses saved yet.
        </div>
      ) : (
        <div className="grid gap-4 mt-6 sm:grid-cols-2">
          {addresses.map((addr, idx) => (
            <div key={idx} className="p-5 border border-slate-200 rounded-xl bg-slate-50 relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => openEdit(idx)} className="text-xs font-bold text-slate-600 hover:text-emerald-600">Edit</button>
                <button onClick={() => handleDelete(idx)} className="text-xs font-bold text-slate-600 hover:text-red-600">Delete</button>
              </div>
              <span className="inline-block px-2 py-1 mb-3 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-md">
                {addr.label}
              </span>
              <p className="font-semibold text-slate-900">{addr.fullName}</p>
              <p className="text-slate-600 text-sm mt-1">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="text-slate-600 text-sm">{addr.addressLine2}</p>}
              <p className="text-slate-600 text-sm">{addr.city}, {addr.state} {addr.pincode}</p>
              <p className="text-slate-600 text-sm mt-2 font-mono">Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
