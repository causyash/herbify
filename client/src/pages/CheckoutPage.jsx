import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { useCart } from '../cart/CartProvider.jsx'
import { api } from '../lib/api'
import { loadRazorpay } from '../payments/razorpay'

export function CheckoutPage() {
  const nav = useNavigate()
  const { user, loading } = useAuth()
  const { items, subtotal, clear } = useCart()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])

  useEffect(() => {
    if (user) {
      api.get('/api/auth/me').then(res => {
        setSavedAddresses(res.data.user?.addresses || [])
      }).catch(console.error)
    }
  }, [user])

  function selectAddress(addr) {
    setFullName(addr.fullName || '')
    setPhone(addr.phone || '')
    setAddressLine1(addr.addressLine1 || '')
    setAddressLine2(addr.addressLine2 || '')
    setCity(addr.city || '')
    setState(addr.state || '')
    setPincode(addr.pincode || '')
  }

  if (!loading && !user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        Checkout
      </h1>
      <p className="mt-2 text-slate-600">Secure payment via Razorpay.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">Your cart is empty.</p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Shop products
            </Link>
            <Link
              to="/cart"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Back to cart
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              setBusy(true)
              try {
                await loadRazorpay()

                const orderRes = await api.post('/api/orders', {
                  shippingAddress: {
                    fullName,
                    phone,
                    addressLine1,
                    addressLine2,
                    city,
                    state,
                    pincode,
                  },
                })

                const order = orderRes.data.order
                const payRes = await api.post('/api/payments/razorpay/create-order', {
                  orderId: order._id,
                })

                const opts = {
                  key: payRes.data.keyId,
                  amount: payRes.data.amount,
                  currency: payRes.data.currency,
                  name: 'Herbify',
                  description: `Order ${order._id}`,
                  order_id: payRes.data.razorpayOrderId,
                  handler: async (response) => {
                    await api.post('/api/payments/razorpay/verify', {
                      orderId: order._id,
                      ...response,
                    })
                    clear()
                    nav(`/account/orders/${order._id}`)
                  },
                  prefill: {
                    name: fullName,
                    contact: phone,
                    email: user?.email,
                  },
                  notes: {
                    orderId: order._id,
                  },
                  theme: {
                    color: '#059669',
                  },
                }

                const rz = new window.Razorpay(opts)
                rz.on('payment.failed', (resp) => {
                  setError(resp?.error?.description || 'Payment failed')
                })
                rz.open()
              } catch (err) {
                setError(err?.response?.data?.message || err?.message || 'Checkout failed')
              } finally {
                setBusy(false)
              }
            }}
            className="lg:col-span-2 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-slate-900">Shipping address</p>
              <Link to="/account" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Manage Addresses</Link>
            </div>

            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-600 mb-2">Select a saved address:</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {savedAddresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAddress(addr)}
                      className="text-left p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    >
                      <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 rounded-md">
                        {addr.label}
                      </span>
                      <p className="font-semibold text-slate-900 text-sm">{addr.fullName}</p>
                      <p className="text-slate-600 text-xs mt-1 truncate">{addr.addressLine1}</p>
                      <p className="text-slate-600 text-xs truncate">{addr.city}, {addr.state} {addr.pincode}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-800">Full name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-800">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Address line 1</span>
              <input
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                required
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-800">Address line 2</span>
              <input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-800">City</span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-800">State</span>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-800">Pincode</span>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                  required
                />
              </label>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {busy ? 'Processing…' : 'Pay with Razorpay'}
              </button>
              <Link
                to="/cart"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Back to cart
              </Link>
            </div>
          </form>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <p className="text-lg font-semibold text-slate-900">Summary</p>
            <div className="mt-4 space-y-2 text-sm">
              {items.slice(0, 5).map((it) => (
                <div key={`${it.itemType}:${it.slug}`} className="flex justify-between gap-3">
                  <span className="text-slate-700">
                    {it.name} × {it.qty}
                  </span>
                  <span className="font-semibold text-slate-900">
                    ₹ {it.price * it.qty}
                  </span>
                </div>
              ))}
              {items.length > 5 ? (
                <p className="text-slate-600">+ {items.length - 5} more…</p>
              ) : null}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">₹ {subtotal}</span>
            </div>
          </aside>
        </div>
      )}
      </div>
    </div>
  )
}

