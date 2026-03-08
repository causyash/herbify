import { Outlet } from 'react-router-dom'
import { Footer } from './site/Footer.jsx'
import { Navbar } from './site/Navbar.jsx'

export function SiteLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

