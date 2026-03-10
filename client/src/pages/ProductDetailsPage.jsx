import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../cart/CartProvider.jsx'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import { ReviewsSection } from '../components/ReviewsSection'
import { useAuth } from '../auth/AuthProvider'

export function ProductDetailsPage() {
  const { user } = useAuth()
  const { slug } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mainImage, setMainImage] = useState('')
  const [adminStock, setAdminStock] = useState('')
  const [updatingStock, setUpdatingStock] = useState(false)

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          setError('')
          setLoading(true)
          const res = await api.get(`/api/products/${slug}`)
          if (!active) return
          setProduct(res.data.product)
          setAdminStock(res.data.product?.stock?.toString() || '0')
          if (res.data.product?.images?.[0]) {
            setMainImage(res.data.product.images[0])
          }
        } catch (err) {
          if (!active) return
          setError(err?.response?.data?.message || 'Failed to load product')
        } finally {
          if (active) setLoading(false)
        }
      })()
    return () => {
      active = false
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition mb-6">
          &larr; Back to products
        </Link>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Loading product…
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : !product ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
            Product not found.
          </div>
        ) : (
          <>
            {user?.role === 'admin' && (
              <div className="mb-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">Admin Controls</span>
                  <p className="text-sm font-semibold text-slate-900 mt-1">Live Inventory Management</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={adminStock}
                    onChange={(e) => setAdminStock(e.target.value)}
                    className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Stock"
                  />
                  <button
                    onClick={async () => {
                      try {
                        setUpdatingStock(true)
                        await api.patch(`/api/admin/products/${product._id}/stock`, { stock: Number(adminStock) })
                        setProduct({ ...product, stock: Number(adminStock) })
                        toast.success('Stock updated live!')
                      } catch {
                        toast.error('Failed to update stock')
                      } finally {
                        setUpdatingStock(false)
                      }
                    }}
                    disabled={updatingStock}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {updatingStock ? 'Saving...' : 'Update Stock'}
                  </button>
                  <Link to={`/admin/products?edit=${product._id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                    Full Array
                  </Link>
                </div>
              </div>
            )}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
              <div className="grid gap-12 lg:grid-cols-2">
                <div className="grid gap-3">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="aspect-square w-full rounded-3xl object-cover transition-all duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-square rounded-3xl bg-slate-100" />
                  )}
                  {product.images?.length > 1 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((img, i) => (
                        <button
                          key={img + i}
                          onClick={() => setMainImage(img)}
                          className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition ${mainImage === img ? 'border-emerald-600' : 'border-transparent'
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
                    {product.name}
                  </h1>
                  {product.categoryId?.name ? (
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      Category: {product.categoryId.name}
                    </p>
                  ) : null}

                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 animate-pulse border border-amber-200">
                      Hurry! Only {product.stock} left in stock.
                    </p>
                  )}

                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-2xl font-semibold text-slate-900">
                      ₹ {product.price}
                    </span>
                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => {
                        addItem({
                          itemType: 'product',
                          itemId: product._id,
                          slug: product.slug,
                          name: product.name,
                          price: product.price,
                          image: product.images?.[0] || '',
                          qty: 1,
                        })
                        toast.success('Added to cart')
                      }}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${product.stock > 0
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-slate-400 cursor-not-allowed'
                        }`}
                    >
                      {product.stock > 0 ? 'Add to cart' : 'Out of Stock'}
                    </button>
                  </div>

                  <div className="mt-8 grid gap-8">
                    <section>
                      <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Description</h3>
                      <p className="mt-4 whitespace-pre-line text-slate-700 leading-relaxed">
                        {product.description}
                      </p>
                    </section>
                    <section>
                      <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Ingredients</h3>
                      {product.ingredients?.length ? (
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
                          {product.ingredients.map((ing) => (
                            <li key={ing}>{ing}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-4 text-slate-600 italic">
                          No ingredients listed.
                        </p>
                      )}
                    </section>
                  </div>
                  {/* Reviews Section Integration */}
                  <ReviewsSection itemType="product" itemId={product._id} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
