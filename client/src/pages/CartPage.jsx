import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartProvider.jsx'
import { useAuth } from '../auth/AuthProvider.jsx'

export function CartPage() {
  const { user } = useAuth()
  const { items, subtotal, syncing, removeItem, setQty, clear } = useCart()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Your Cart
        </h1>
        <p className="mt-2 text-slate-600">
        {syncing && user ? 'Syncing with your account…' : 'Review your items.'}
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">Your cart is empty.</p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Shop products
            </Link>
            <Link
              to="/herbs"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Browse herbs
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-3">
            {items.map((it) => (
              <div
                key={`${it.itemType}:${it.slug}`}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {it.image ? (
                  <img
                    src={it.image}
                    alt={it.name}
                    className="size-20 rounded-xl object-cover bg-slate-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="size-20 rounded-xl bg-slate-100" />
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{it.name}</p>
                      <p className="text-sm text-slate-600 capitalize">
                        {it.itemType}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-slate-900">
                      ₹ {it.price}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      Qty
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={it.qty}
                        onChange={(e) =>
                          setQty(it.itemType, it.slug, Number(e.target.value))
                        }
                        className="w-20 rounded-xl border border-slate-300 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeItem(it.itemType, it.slug)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <p className="text-lg font-semibold text-slate-900">Summary</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">₹ {subtotal}</span>
            </div>
            <div className="mt-6 grid gap-3">
              <Link
                to="/checkout"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={() => clear()}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Clear cart
              </button>
            </div>
          </aside>
        </div>
      )}
      </div>
    </div>
  )
}

