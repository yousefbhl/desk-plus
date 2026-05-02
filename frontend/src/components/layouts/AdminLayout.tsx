import { Link, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <main className="container">
      <h1>Admin</h1>
      <nav className="nav-links">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/reports">Reports</Link>
      </nav>
      <Outlet />
    </main>
  )
}
