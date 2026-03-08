import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { io } from 'socket.io-client'

export function AdminOrdersPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    const res = await api.get('/api/admin/orders')
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
        setError(err?.response?.data?.message || 'Failed to load orders')
      } finally {
        if (active) setLoading(false)
      }
    })()

    // Socket for live order updates
    const socket = io('http://localhost:5000', { withCredentials: true })
    socket.on('new-order', () => {
      load().catch(() => {})
    })

    return () => {
      active = false
      socket.disconnect()
    }
  }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/api/admin/orders/${id}/status`, { orderStatus: status })
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="mt-2 text-slate-600">Manage customer orders and status.</p>
        </div>
        <button
          onClick={load}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {items.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="grid gap-1">
                <p className="font-semibold text-slate-900">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-slate-600">
                  {order.userId?.name} ({order.userId?.email})
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold outline-none ring-emerald-500 focus:ring-2"
                >
                  <option value="placed">Placed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.paymentStatus}
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="grid gap-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">
                      {item.name} <span className="text-slate-400">× {item.qty}</span>
                    </span>
                    <span className="font-medium text-slate-900">
                      ₹ {item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3 font-semibold text-slate-900">
                <span>Total</span>
                <span>₹ {order.total}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold uppercase tracking-wide text-slate-500">
                Shipping Address
              </p>
              <p className="mt-1">
                {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">No orders found.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
