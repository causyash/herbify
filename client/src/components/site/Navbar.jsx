import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider.jsx'
import { useCart } from '../../cart/CartProvider.jsx'
import { Menu, X, ShoppingCart, User as UserIcon, Search } from 'lucide-react'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`

const mobileNavLinkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-base font-medium transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`

export function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cartCount = items.reduce((acc, item) => acc + (item.qty || 1), 0)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsOpen(false)
    }
  }

  // Track path to close menu when changing routes
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    if (isOpen) setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Herbify Logo" className="size-10 rounded-xl object-contain drop-shadow-sm" />
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Herbify
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
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

          <form onSubmit={handleSearch} className="relative ml-2 flex items-center">
            <input 
              type="text" 
              placeholder="Search herbs, products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 xl:w-64 rounded-full bg-slate-100 px-4 py-2 pl-10 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </form>

          <div className="mx-2 h-6 w-px bg-slate-200"></div>

          <NavLink to="/cart" className="relative p-2 text-slate-700 hover:text-emerald-600 transition">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <div className="group relative ml-2 flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-slate-100">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <UserIcon size={18} />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </div>
              <div className="absolute right-0 top-full mt-1 hidden w-48 flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-lg group-hover:flex">
                <Link to="/account/profile" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Profile
                </Link>
                <Link to="/account/orders" className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                    Admin Dashboard
                  </Link>
                )}
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <NavLink to="/login" className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                Register
              </NavLink>
            </div>
          )}
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-4">
          <NavLink to="/cart" className="relative p-2 text-slate-700">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-700 hover:text-emerald-600"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <NavLink to="/" className={mobileNavLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/herbs" className={mobileNavLinkClass}>
              Herbs
            </NavLink>
            <NavLink to="/products" className={mobileNavLinkClass}>
              Products
            </NavLink>
            <NavLink to="/about" className={mobileNavLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={mobileNavLinkClass}>
              Contact
            </NavLink>

            <form onSubmit={handleSearch} className="relative mt-2">
              <input 
                type="text" 
                placeholder="Search herbs, products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-100 px-4 py-3 pl-11 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </form>

            <div className="my-2 border-t border-slate-100"></div>

            {user ? (
              <>
                <div className="px-3 py-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Account ({user.name})
                </div>
                <NavLink to="/account/profile" className={mobileNavLinkClass}>
                  Profile
                </NavLink>
                <NavLink to="/account/orders" className={mobileNavLinkClass}>
                  Orders
                </NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={mobileNavLinkClass}>
                    Admin Dashboard
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="mt-2 w-full rounded-md px-3 py-3 text-left font-medium text-red-600 bg-red-50 hover:bg-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <NavLink to="/login" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-medium text-slate-700 shadow-sm">
                  Login
                </NavLink>
                <NavLink to="/register" className="rounded-xl bg-emerald-600 px-4 py-3 text-center font-semibold text-white shadow-sm hover:bg-emerald-700">
                  Register
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
