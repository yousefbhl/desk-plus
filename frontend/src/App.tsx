import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout'
import AdminLayout from './components/layouts/AdminLayout'
import SellerLayout from './components/layouts/SellerLayout'
import AuthGuard from './components/guards/AuthGuard'
import AdminGuard from './components/guards/AdminGuard'
import SellerGuard from './components/guards/SellerGuard'

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Auth
const Login          = lazy(() => import('./pages/Login'))
const Register       = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const OAuthCallback  = lazy(() => import('./pages/OAuthCallback'))
const ChooseRole     = lazy(() => import('./pages/ChooseRole'))

// Customer
const Home          = lazy(() => import('./pages/Home'))
const Products      = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Spaces        = lazy(() => import('./pages/Spaces'))
const Styles        = lazy(() => import('./pages/Styles'))
const Cart          = lazy(() => import('./pages/Cart'))
const Checkout      = lazy(() => import('./pages/Checkout'))
const Account       = lazy(() => import('./pages/Account'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))

// Admin (Recharts only loads when /admin is visited)
const Dashboard      = lazy(() => import('./admin/Dashboard'))
const AdminProducts  = lazy(() => import('./admin/AdminProducts'))
const AdminOrders    = lazy(() => import('./admin/AdminOrders'))
const AdminUsers     = lazy(() => import('./admin/AdminUsers'))
const AdminReports   = lazy(() => import('./admin/AdminReports'))
const AdminDiscounts = lazy(() => import('./admin/AdminDiscounts'))
const AdminSellers   = lazy(() => import('./admin/AdminSellers'))

// Seller
const SellerDashboard = lazy(() => import('./seller/SellerDashboard'))
const SellerProducts  = lazy(() => import('./seller/SellerProducts'))
const SellerOrders    = lazy(() => import('./seller/SellerOrders'))
const SellerStats     = lazy(() => import('./seller/SellerStats'))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* OAuth landing routes — public, outside layouts/guards */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/choose-role"    element={<ChooseRole />} />

        <Route element={<MainLayout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/products"       element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/spaces"         element={<Spaces />} />
          <Route path="/styles"         element={<Styles />} />
          <Route path="/cart"           element={<Cart />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<AuthGuard />}>
            <Route path="/checkout"   element={<Checkout />} />
            <Route path="/account"    element={<Account />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
          </Route>
        </Route>

        {/* ADMIN — admins only */}
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
          <Route index            element={<Dashboard />} />
          <Route path="products"  element={<AdminProducts />} />
          <Route path="orders"    element={<AdminOrders />} />
          <Route path="users"     element={<AdminUsers />} />
          <Route path="reports"   element={<AdminReports />} />
          <Route path="discounts" element={<AdminDiscounts />} />
          <Route path="sellers"   element={<AdminSellers />} />
        </Route>

        {/* SELLER — sellers only, own layout */}
        <Route
          path="/seller"
          element={
            <AuthGuard>
              <SellerGuard>
                <SellerLayout />
              </SellerGuard>
            </AuthGuard>
          }
        >
          <Route index           element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="orders"   element={<SellerOrders />} />
          <Route path="stats"    element={<SellerStats />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App