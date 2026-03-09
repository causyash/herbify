import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../cart/CartProvider.jsx'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

export function HerbDetailsPage() {
  const { slug } = useParams()
  const { addItem } = useCart()
  const [herb, setHerb] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mainImage, setMainImage] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const res = await api.get(`/api/herbs/${slug}`)
        if (!active) return
        setHerb(res.data.herb)
        if (res.data.herb?.images?.[0]) {
          setMainImage(res.data.herb.images[0])
        }
      } catch (err) {
        if (!active) return
        setError(err?.response?.data?.message || 'Failed to load herb')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [slug])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/herbs" className="text-sm font-medium text-emerald-700">
        ← Back to herbs
      </Link>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Loading herb…
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      ) : !herb ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
          Herb not found.
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="grid gap-3">
            {mainImage ? (
              <img
                src={mainImage}
                alt={herb.name}
                className="aspect-square w-full rounded-3xl object-cover transition-all duration-300"
                loading="lazy"
              />
            ) : (
              <div className="aspect-square rounded-3xl bg-slate-100" />
            )}
            {herb.images?.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {herb.images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setMainImage(img)}
                    className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                      mainImage === img ? 'border-emerald-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {herb.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold text-slate-900">
                ₹ {herb.price}
              </span>
              <button
                type="button"
                onClick={() => {
                  addItem({
                    itemType: 'herb',
                    itemId: herb._id,
                    slug: herb.slug,
                    name: herb.name,
                    price: herb.price,
                    image: herb.images?.[0] || '',
                    qty: 1,
                  })
                  toast.success('Added to cart')
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Add to cart
              </button>
            </div>

            <div className="mt-8 grid gap-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900">Description</p>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                  {herb.description}
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900">Uses</p>
                {herb.uses?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {herb.uses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No uses listed.</p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900">Benefits</p>
                {herb.benefits?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {herb.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">
                    No benefits listed.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

