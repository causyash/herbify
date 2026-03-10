import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

export function AdminInventoryPage() {
  const [products, setProducts] = useState([])
  const [herbs, setHerbs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // all, product, herb

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          const [prodRes, herbRes, catRes] = await Promise.all([
            api.get('/api/admin/products'),
            api.get('/api/admin/herbs'),
            api.get('/api/admin/categories')
          ])
          if (!active) return

          setProducts(prodRes.data.items || [])
          setHerbs(herbRes.data.items || [])
          setCategories(catRes.data.items || [])
        } catch (err) {
          console.error("Failed to fetch inventory", err)
        } finally {
          if (active) setLoading(false)
        }
      })()

    return () => { active = false }
  }, [])

  // Combine products and herbs into a single inventory list
  const combinedInventory = [
    ...products.map(p => ({ ...p, itemType: 'product' })),
    ...herbs.map(h => ({ ...h, itemType: 'herb', categoryId: null }))
  ]

  // Filter logic
  const filteredInventory = combinedInventory.filter(item => {
    // 1. Search text filter
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.slug && item.slug.toLowerCase().includes(search.toLowerCase()))

    // 2. Type filter
    const matchesType = typeFilter === 'all' || item.itemType === typeFilter

    // 3. Category filter
    const matchesCategory = categoryFilter === '' ||
      (item.categoryId && (item.categoryId._id || item.categoryId) === categoryFilter)

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Master Inventory
      </h1>
      <p className="mt-2 text-slate-600">
        Search and filter through all products and herbs across categories.
      </p>

      {/* Controls */}
      <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-emerald-500 focus:ring-2"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-auto rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-emerald-500 focus:ring-2 bg-white"
        >
          <option value="all">All Types</option>
          <option value="product">Products</option>
          <option value="herb">Herbs</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-auto rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-emerald-500 focus:ring-2 bg-white"
          disabled={typeFilter === 'herb'} // Herbs don't have categories in this structure
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-slate-500 text-center">Loading inventory data...</p>
        ) : filteredInventory.length === 0 ? (
          <p className="p-8 text-slate-500 text-center italic">No items found matching your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-4 pl-6 pr-4 font-bold">Item Name</th>
                  <th className="py-4 pr-4 font-bold">Type</th>
                  <th className="py-4 pr-4 font-bold">Category</th>
                  <th className="py-4 pr-4 font-bold">Price</th>
                  <th className="py-4 pr-4 font-bold">Stock</th>
                  <th className="py-4 pr-6 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          {item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-700 capitalize">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${item.itemType === 'product' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {item.itemType}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-700">
                      {item.categoryId?.name || <span className="text-slate-400 italic">None</span>}
                    </td>
                    <td className="py-4 pr-4 text-slate-700 font-medium">₹ {item.price}</td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.stock <= 5 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                        {item.stock} left
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <Link
                        to={`/admin/${item.itemType}s?edit=${item._id}`}
                        className="text-emerald-600 hover:text-emerald-800 font-semibold text-sm hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
