import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

export function AdminHomePage() {
  const [stats, setStats] = useState({
    products: 0,
    herbs: 0,
    categories: 0,
    users: 0,
    totalStockValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [prodRes, herbRes, catRes, userRes] = await Promise.all([
          api.get('/api/admin/products'),
          api.get('/api/admin/herbs'),
          api.get('/api/admin/categories'),
          api.get('/api/admin/users')
        ])
        if (!active) return

        const products = prodRes.data.items || []
        const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0)

        setStats({
          products: products.length,
          herbs: (herbRes.data.items || []).length,
          categories: (catRes.data.items || []).length,
          users: (userRes.data.items || []).length,
          totalStockValue
        })
      } catch (err) {
        console.error("Failed to fetch analytics", err)
      } finally {
        if(active) setLoading(false)
      }
    })()
    
    return () => { active = false }
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Dashboard Analytics
      </h1>
      <p className="mt-2 text-slate-600">
        Overview of your inventory and platform metrics.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading analytics...</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p className="text-sm font-medium text-slate-500">Total Products</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{stats.products}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p className="text-sm font-medium text-slate-500">Live Herbs</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.herbs}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.users}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
            <p className="text-sm font-medium text-slate-500">Total Stock Value</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">₹ {stats.totalStockValue.toLocaleString()}</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold tracking-tight text-slate-900 mt-12 mb-4">
        Quick Management
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { to: '/admin/categories', title: 'Categories', body: 'Create and organize categories and subcategories.' },
          { to: '/admin/herbs', title: 'Herbs', body: 'Add herb profiles, uses, benefits, pricing, and images.' },
          { to: '/admin/products', title: 'Products', body: 'Manage products and assign them to categories.' },
          { to: '/admin/users', title: 'Users', body: 'Manage platform users and administrators.' },
          { to: '/admin/orders', title: 'Orders', body: 'Track order statuses and manage fulfillment.' },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50 transition"
          >
            <p className="font-semibold text-slate-900">{c.title}</p>
            <p className="mt-1 text-sm text-slate-600">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
