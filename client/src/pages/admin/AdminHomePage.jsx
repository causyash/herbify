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
  const [bestsellers, setBestsellers] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingBestsellers, setLoadingBestsellers] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        // Main stats load
        const [prodRes, herbRes, catRes, userRes] = await Promise.all([
          api.get('/api/admin/products'),
          api.get('/api/admin/herbs'),
          api.get('/api/admin/categories'),
          api.get('/api/admin/users')
        ])
        if (!active) return

        const products = prodRes.data.items || []
        const herbsList = herbRes.data.items || []
        const categories = catRes.data.items || []
        
        const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0) + 
                                herbsList.reduce((acc, h) => acc + (h.price * (h.stock || 0)), 0)

        setCategoriesList(categories)
        setStats({
          products: products.length,
          herbs: herbsList.length,
          categories: categories.length,
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

  // Bestsellers effect
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoadingBestsellers(true)
        const url = selectedCategory 
          ? `/api/admin/bestsellers?category=${selectedCategory}` 
          : `/api/admin/bestsellers`
        const res = await api.get(url)
        if (!active) return
        setBestsellers(res.data.items || [])
      } catch (err) {
        console.error("Failed to fetch bestsellers", err)
      } finally {
        if(active) setLoadingBestsellers(false)
      }
    })()
    
    return () => { active = false }
  }, [selectedCategory])



  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Inventory Management & Analytics
      </h1>
      <p className="mt-2 text-slate-600">
        Interactive overview of your platform metrics, product variations, and bestsellers.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading analytics...</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Products</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{stats.products}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Herbs</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">{stats.herbs}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Platform Users</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.users}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-emerald-700 text-white p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-100">Stock Value</p>
              <p className="text-4xl font-bold mt-2">₹ {stats.totalStockValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Top Bestsellers <span className="text-sm font-normal text-slate-500 ml-2">(Live from existing orders)</span>
              </h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none ring-emerald-500 focus:ring-2 max-w-xs"
              >
                <option value="">All Categories (includes Herbs)</option>
                {categoriesList.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="overflow-x-auto">
              {loadingBestsellers ? (
                <p className="text-slate-500 text-sm py-4">Loading top selling items...</p>
              ) : bestsellers.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 italic">No bestsellers found for the selected filter.</p>
              ) : (
                <div className="grid gap-4 mt-2">
                  {bestsellers.map((item, idx) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-xl overflow-hidden hidden sm:block">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{item.itemType}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-emerald-600">{item.totalSold} sold</p>
                        <p className={`text-xs font-semibold ${item.stock <= 5 ? 'text-red-600' : 'text-slate-500'}`}>
                          {item.stock} left
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <h2 className="text-xl font-semibold tracking-tight text-slate-900 mt-12 mb-4">
        Deep Dive Management
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { to: '/admin/products', title: 'Products', body: 'Adjust stocks and assign combinations.' },
          { to: '/admin/herbs', title: 'Herbs', body: 'Add herb profiles and pricing.' },
          { to: '/admin/categories', title: 'Categories', body: 'Organize dynamic category trees.' },
          { to: '/admin/users', title: 'Audience', body: 'Manage platform users and roles.' },
          { to: '/admin/orders', title: 'Fulfillment', body: 'Track order statuses directly.' },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1"
          >
            <p className="text-lg font-bold text-slate-900 group-hover:text-emerald-600">{c.title}</p>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
