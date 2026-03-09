import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  
  const [herbs, setHerbs] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let active = true
    if (!q) return
    
    ;(async () => {
      try {
        setLoading(true)
        const [herbRes, prodRes] = await Promise.all([
          api.get(`/api/herbs?q=${encodeURIComponent(q)}`),
          api.get(`/api/products?q=${encodeURIComponent(q)}`)
        ])
        
        if (!active) return
        
        setHerbs(herbRes.data.items || [])
        setProducts(prodRes.data.items || [])
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        if (active) setLoading(false)
      }
    })()
    
    return () => { active = false }
  }, [q])

  const totalResults = herbs.length + products.length

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Search Results
        </h1>
        <p className="text-slate-600 mb-10">
          Showing {totalResults} result{totalResults !== 1 && 's'} for "{q}"
        </p>

        {!q ? (
          <div className="text-center py-20 text-slate-500 text-lg">
            Please enter a search term above to find herbs and products.
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-emerald-600 font-medium animate-pulse">
            Searching our catalog...
          </div>
        ) : totalResults === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No matches found</h3>
            <p className="text-slate-500">We couldn't find anything matching "{q}". Try checking for typos or using broader terms.</p>
            <Link to="/products" className="inline-block mt-6 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-12">
            {/* Products Results */}
            {products.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">{products.length} found</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((p) => (
                    <Link key={p._id} to={`/products/${p.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md block hover:-translate-y-1">
                      <div className="aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden relative">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                        ) : null}
                      </div>
                      <h3 className="mt-4 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600">{p.name}</h3>
                      <p className="mt-1 text-emerald-600 font-bold">₹ {p.price}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Herbs Results */}
            {herbs.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Raw Herbs</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">{herbs.length} found</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {herbs.map((h) => (
                    <Link key={h._id} to={`/herbs/${h.slug}`} className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md block hover:-translate-y-1">
                      <div className="aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden relative">
                        {h.images?.[0] ? (
                          <img src={h.images[0]} alt={h.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                        ) : null}
                      </div>
                      <h3 className="mt-4 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600">{h.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-2 leading-relaxed">{h.shortDescription}</p>
                      <p className="mt-auto text-emerald-600 font-bold">₹ {h.price}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
