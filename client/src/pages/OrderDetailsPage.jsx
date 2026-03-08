import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../lib/api'

export function OrderDetailsPage() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const [order, setOrder] = useState(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let active = true
    ;(async () => {
      try {
        setError('')
        setBusy(true)
        const res = await api.get(`/api/orders/${id}`)
        if (!active) return
        setOrder(res.data.order)
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load order')
      } finally {
        if (active) setBusy(false)
      }
    })()
    return () => {
      active = false
    }
  }, [user, id])

  if (!loading && !user) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/account/orders" className="text-sm font-medium text-emerald-700">
        ← Back to orders
      </Link>

      {busy ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading order…
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : !order ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Order not found.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Order {order._id}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Status: {order.orderStatus} • Payment: {order.paymentStatus}
                </p>
              </div>
              <p className="shrink-0 text-lg font-semibold text-slate-900">
                ₹ {order.total}
              </p>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="font-semibold text-slate-900">Items</p>
              <div className="mt-3 grid gap-3">
                {(order.items || []).map((it) => (
                  <div
                    key={`${it.itemType}:${it.slug}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt=""
                          className="size-12 rounded-xl object-cover bg-slate-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="size-12 rounded-xl bg-slate-100" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{it.name}</p>
                        <p className="text-sm text-slate-600">
                          {it.itemType} • Qty {it.qty}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ₹ {it.price * it.qty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <p className="font-semibold text-slate-900">Shipping</p>
            <div className="mt-3 text-sm text-slate-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 ? (
                <p>{order.shippingAddress?.addressLine2}</p>
              ) : null}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.pincode}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

