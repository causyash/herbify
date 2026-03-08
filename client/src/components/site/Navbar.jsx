import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider.jsx'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white font-semibold">
            H
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Herbify
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/herbs" className={navLinkClass}>
            Herbs
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            Cart
          </NavLink>

          {user ? (
            <>
              <span className="hidden sm:inline px-3 py-2 text-sm text-slate-600">
                Hi, {user.name}
              </span>
              <NavLink to="/account/orders" className={navLinkClass}>
                Orders
              </NavLink>
              {user.role === 'admin' ? (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              ) : null}
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

