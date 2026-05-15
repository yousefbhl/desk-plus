import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import AdminLayout from './components/layouts/AdminLayout'
import AuthGuard from './components/guards/AuthGuard'
import AdminGuard from './components/guards/AdminGuard'

// Customer pages
import Home           from './pages/Home'
import Products       from './pages/Products'
import ProductDetail  from './pages/ProductDetail'
import Spaces         from './pages/Spaces'
import Styles         from './pages/Styles'
import Cart           from './pages/Cart'
import Checkout       from './pages/Checkout'
import Account        from './pages/Account'
import OrderTracking  from './pages/OrderTracking'

// Auth pages
import Login          from './pages/Login'
import Register       from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

// Admin pages
import Dashboard      from './admin/Dashboard'
import AdminProducts  from './admin/AdminProducts'
import AdminOrders    from './admin/AdminOrders'
import AdminUsers     from './admin/AdminUsers'
import AdminReports   from './admin/AdminReports'
import AdminDiscounts from './admin/AdminDiscounts'
import AdminSellers   from './admin/AdminSellers'

function App() {
  return (
    <Routes>
      {/* ── Customer + Public ── */}
      <Route element={<MainLayout />}>
        <Route path="/"            element={<Home />} />
        <Route path="/products"    element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/spaces"      element={<Spaces />} />
        <Route path="/styles"      element={<Styles />} />
        <Route path="/cart"        element={<Cart />} />

        {/* Auth routes (redirect to / if already logged in) */}
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected customer routes */}
        <Route element={<AuthGuard />}>
          <Route path="/checkout"     element={<Checkout />} />
          <Route path="/account"      element={<Account />} />
          <Route path="/orders/:id"   element={<OrderTracking />} />
        </Route>
      </Route>

      {/* ── Admin ── */}
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          </AuthGuard>
        }
      >
        <Route index                element={<Dashboard />} />
        <Route path="products"      element={<AdminProducts />} />
        <Route path="orders"        element={<AdminOrders />} />
        <Route path="users"         element={<AdminUsers />} />
        <Route path="reports"       element={<AdminReports />} />
        <Route path="discounts"     element={<AdminDiscounts />} />
        <Route path="sellers"       element={<AdminSellers />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
