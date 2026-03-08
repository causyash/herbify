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
          api.get('/api/herbs', { params: { limit: 3 } }),
          api.get('/api/products', { params: { limit: 3 } }),
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-500 px-6 py-12 text-white shadow-sm sm:px-10">
        <p className="text-sm/6 font-medium text-emerald-50">
          Medicinal herbs • Herbal products • Natural healing
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          Explore herbs. Learn benefits. Buy herbal products.
        </h1>
        <p className="mt-4 max-w-2xl text-emerald-50/95">
          Herbify is a modern herbal education + e-commerce platform for
          medicinal herbs and curated herbal products.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/herbs"
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Browse herbs
          </Link>
          <Link
            to="/products"
            className="rounded-xl bg-emerald-900/30 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-emerald-900/40"
          >
            Shop products
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'Educational herb profiles',
            body: 'Uses and benefits with clear, readable summaries.',
          },
          {
            title: 'Curated herbal products',
            body: 'Browse categories and product details before you buy.',
          },
          {
            title: 'Fast checkout',
            body: 'Secure payments with Razorpay (test-mode during development).',
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="font-semibold text-slate-900">{card.title}</p>
            <p className="mt-1 text-sm text-slate-600">{card.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Featured herbs</h2>
            <Link to="/herbs" className="text-sm font-semibold text-emerald-700">
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {featuredHerbs.length ? (
              featuredHerbs.map((h) => (
                <Link
                  key={h.slug}
                  to={`/herbs/${h.slug}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{h.name}</p>
                    <p className="text-sm text-slate-600">{h.shortDescription}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-900">
                    ₹ {h.price}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                Start the API and seed data to see featured items.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Featured products
            </h2>
            <Link
              to="/products"
              className="text-sm font-semibold text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {featuredProducts.length ? (
              featuredProducts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-sm text-slate-600">
                      In stock: {p.stock}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-900">
                    ₹ {p.price}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                Start the API and seed data to see featured items.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

