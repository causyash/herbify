import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { api } from '../lib/api'

export function ProfilePage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await api.get('/api/orders/my')
        if (active) setOrders(res.data.items || [])
      } catch {
        // ignore for now
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-600">Please sign in to view your profile.</p>
        <Link to="/login" className="mt-4 inline-block text-emerald-600 hover:underline">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
      
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
            <p className="text-slate-600">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-700">
              Role: {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Recent Orders</h2>
          <Link to="/account/orders" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-600">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="mt-4 grid gap-4">
            {orders.slice(0, 3).map((o) => (
              <div key={o._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
                <div>
                  <p className="text-sm text-slate-500">Order ID: <span className="font-mono text-slate-900">{o._id}</span></p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Total: ₹ {o.totalAmount}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {o.orderStatus || 'Placed'}
                  </span>
                  <Link
                    to={`/account/orders/${o._id}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
