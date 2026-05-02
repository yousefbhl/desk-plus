import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/">Desk+</Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/spaces">Spaces</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  )
}
