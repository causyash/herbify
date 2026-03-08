import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { io } from 'socket.io-client'

const linkClass = ({ isActive }) =>
  `block rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
  }`

export function AdminLayout() {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Connect to socket
    const socket = io('http://localhost:5000', {
      withCredentials: true,
    })

    socket.on('connect', () => {
      socket.emit('join-admin')
    })

    socket.on('new-order', (order) => {
      setNotifications((prev) => [
        {
          id: order.id,
          message: `New Order #${order.id.slice(-6).toUpperCase()} by ${order.customer}`,
          amount: `₹${order.total}`,
          time: new Date(order.time),
          unread: true,
        },
        ...prev,
      ].slice(0, 10))
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Order Recieved!', {
          body: `${order.customer} just placed an order for ₹${order.total}`,
        })
      }
    })

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Console</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time management & insights</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`relative rounded-2xl p-2.5 transition-all duration-200 ${
              isOpen ? 'bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-40 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center mb-1">
                  <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                      </div>
                      <p className="text-xs text-slate-400">No new notifications</p>
                    </div>
                  ) : (
                    <div className="grid gap-1">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`group relative rounded-xl p-3 transition border border-transparent ${
                            n.unread ? 'bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-100' : 'hover:bg-slate-50 hover:border-slate-100'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`text-xs leading-relaxed ${n.unread ? 'text-slate-900 font-semibold' : 'text-slate-600 font-medium'}`}>
                                {n.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {n.amount}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            {n.unread && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-50 px-2">
                    <button 
                      onClick={() => setNotifications([])}
                      className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1 h-fit">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Navigation
          </p>
          <nav className="grid gap-1">
            <NavLink to="/admin" end className={linkClass}>
              Overview
            </NavLink>
            <NavLink to="/admin/categories" className={linkClass}>
              Categories
            </NavLink>
            <NavLink to="/admin/herbs" className={linkClass}>
              Herbs
            </NavLink>
            <NavLink to="/admin/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/admin/contacts" className={linkClass}>
              Contacts
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>
              Orders
            </NavLink>
          </nav>
        </aside>

        <section className="lg:col-span-3">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

