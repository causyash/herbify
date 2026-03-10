import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function TitleUpdater() {
  const location = useLocation()

  useEffect(() => {
    let base = 'Herbify'
    const path = location.pathname

    if (path === '/') base += ' | Home'
    else if (path.startsWith('/admin')) base += ' | Admin Dashboard'
    else if (path.startsWith('/herbs/')) base += ' | Herb Details'
    else if (path.startsWith('/herbs')) base += ' | Herbs'
    else if (path.startsWith('/products/')) base += ' | Product Details'
    else if (path.startsWith('/products')) base += ' | Products'
    else if (path.startsWith('/cart')) base += ' | Cart'
    else if (path.startsWith('/checkout')) base += ' | Checkout'
    else if (path.startsWith('/account/profile')) base += ' | Profile'
    else if (path.startsWith('/account/orders/')) base += ' | Order Details'
    else if (path.startsWith('/account/orders')) base += ' | Orders'
    else if (path.startsWith('/login')) base += ' | Login'
    else if (path.startsWith('/register')) base += ' | Register'
    else if (path.startsWith('/about')) base += ' | About'
    else if (path.startsWith('/contact')) base += ' | Contact'
    else if (path.startsWith('/search')) base += ' | Search'

    document.title = base
  }, [location.pathname])

  return null
}
