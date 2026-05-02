import { Link, Outlet } from 'react-router-dom'

export default function SellerLayout() {
  return (
    <main className="container">
      <h1>Seller</h1>
      <nav className="nav-links">
        <Link to="/seller">Overview</Link>
        <Link to="/seller/products">Products</Link>
        <Link to="/seller/stats">Stats</Link>
      </nav>
      <Outlet />
    </main>
  )
}
