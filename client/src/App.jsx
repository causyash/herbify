import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout.jsx'
import { AdminLayout } from './admin/AdminLayout.jsx'
import { RequireAdmin } from './admin/RequireAdmin.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { CartPage } from './pages/CartPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { HerbDetailsPage } from './pages/HerbDetailsPage.jsx'
import { HerbsListPage } from './pages/HerbsListPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { OrderDetailsPage } from './pages/OrderDetailsPage.jsx'
import { OrdersPage } from './pages/OrdersPage.jsx'
import { ProductDetailsPage } from './pages/ProductDetailsPage.jsx'
import { ProductsListPage } from './pages/ProductsListPage.jsx'
import { SearchPage } from './pages/SearchPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.jsx'
import { AdminContactsPage } from './pages/admin/AdminContactsPage.jsx'
import { AdminHerbsPage } from './pages/admin/AdminHerbsPage.jsx'
import { AdminHomePage } from './pages/admin/AdminHomePage.jsx'
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage.jsx'
import { AdminProductsPage } from './pages/admin/AdminProductsPage.jsx'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.jsx'
import { AdminUsersPage } from './pages/admin/AdminUsersPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'

import { Toaster } from 'react-hot-toast'
import { TitleUpdater } from './components/TitleUpdater.jsx'

export default function App() {
  return (
    <>
      <TitleUpdater />
      <Toaster position="bottom-right" />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/herbs" element={<HerbsListPage />} />
          <Route path="/herbs/:slug" element={<HerbDetailsPage />} />

          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailsPage />} />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="herbs" element={<AdminHerbsPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="contacts" element={<AdminContactsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  )
}

