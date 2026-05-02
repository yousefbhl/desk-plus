import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './admin/Dashboard'
import AdminOrders from './admin/AdminOrders'
import AdminProducts from './admin/AdminProducts'
import AdminReports from './admin/AdminReports'
import AdminUsers from './admin/AdminUsers'
import MainLayout from './components/layouts/MainLayout'
import AdminLayout from './components/layouts/AdminLayout'
import SellerLayout from './components/layouts/SellerLayout'
import AdminGuard from './components/guards/AdminGuard'
import AuthGuard from './components/guards/AuthGuard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Spaces from './pages/Spaces'
import SellerDashboard from './seller/SellerDashboard'
import SellerProducts from './seller/SellerProducts'
import SellerStats from './seller/SellerStats'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
      </Route>

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
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route
        path="/seller"
        element={
          <AuthGuard>
            <SellerLayout />
          </AuthGuard>
        }
      >
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="stats" element={<SellerStats />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
