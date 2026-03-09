import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export function HomePage() {
  const [featuredHerbs, setFeaturedHerbs] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [herbsRes, productsRes] = await Promise.all([
          api.get('/api/herbs', { params: { limit: 4 } }),
          api.get('/api/products', { params: { limit: 4 } }),
        ])
        if (!active) return
        setFeaturedHerbs(herbsRes.data.items || [])
        setFeaturedProducts(productsRes.data.items || [])
      } catch {
        // non-blocking; homepage still works without API
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative flex h-[600px] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.png"
            alt="Herbs on rustic table"
            className="h-full w-full object-cover brightness-[0.65]"
          />
        </div>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Premium Botanical Wellness
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-7xl drop-shadow-lg">
            Elevate Your Everyday with <span className="text-emerald-400">Nature.</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-200 drop-shadow-md sm:text-xl">
            Discover a curated collection of pure, potent, and ethically sourced medicinal herbs, essential oils, and wellness blends designed to bring balance back into your life.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/products"
              className="rounded-full bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-emerald-500"
            >
              Shop Star Products
            </Link>
            <Link
              to="/herbs"
              className="rounded-full bg-white/20 px-8 py-4 text-lg font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-white/30"
            >
              Explore Herbs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600">
            Our Star Collection
          </h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Customer Favorites
          </h3>
          <p className="mt-4 text-slate-600">
            Handpicked, best-selling wellness products loved by our community.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={p.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                    alt={p.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  {p.stock < 10 && p.stock > 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      Low Stock
                    </span>
                  )}
                  {p.stock === 0 && (
                    <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      Sold Out
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                  <p className="mt-2 flex-1 text-sm text-slate-500 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="mt-4 text-xl font-bold text-emerald-600">₹ {p.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-slate-500">
              No products found. Please seed the database.
            </p>
          )}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-block rounded-full border-2 border-slate-900 px-8 py-3 font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-emerald-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            Why Choose Herbify?
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {[
              { title: '100% Pure & Organic', body: 'We source only the cleanest, pesticide-free botanicals from ethical farms.' },
              { title: 'Expert Formulated', body: 'Our blends are crafted with guidance from clinical herbalists for maximum efficacy.' },
              { title: 'Sustainable Quality', body: 'Eco-friendly packaging and fair-trade practices that respect the earth.' }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800">
                  <span className="text-2xl font-bold text-emerald-300">{idx + 1}</span>
                </div>
                <h3 className="mb-2 font-bold text-xl">{feature.title}</h3>
                <p className="text-emerald-100/80">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Herbs */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 flex items-baseline justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Botanical Directory
            </h2>
            <p className="mt-2 text-slate-600">
              Learn about the core ingredients powering our products.
            </p>
          </div>
          <Link to="/herbs" className="hidden font-semibold text-emerald-600 hover:text-emerald-700 sm:block">
            See entire directory &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {featuredHerbs.map((h) => (
            <Link
              key={h.slug}
              to={`/herbs/${h.slug}`}
              className="group flex flex-col gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-xl sm:flex-row items-center"
            >
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                 <img
                    src={h.images?.[0] || 'https://placehold.co/150x150?text=No+Image'}
                    alt={h.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600">{h.name}</h4>
                <p className="mb-3 mt-1 text-sm text-slate-600 line-clamp-2">{h.shortDescription}</p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  Raw Herb Base
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link to="/herbs" className="font-semibold text-emerald-600 hover:text-emerald-700">
            See entire directory &rarr;
          </Link>
        </div>
      </section>

    </div>
  )
}
