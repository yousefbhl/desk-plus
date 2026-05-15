import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import CartDrawer from './CartDrawer'

const NAV_LINKS = [
  { to: '/products', label: 'Products',  key: 'products' },
  { to: '/spaces',   label: 'Spaces',    key: 'spaces' },
  { to: '/styles',   label: 'Styles',    key: 'styles' },
]

export default function Navbar() {
  const [cartOpen, setCartOpen]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const navigate = useNavigate()

  const { isAuth, user, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
      setSearchVal('')
    }
  }

  return (
    <>
      <header className="nav-glass sticky top-0 z-40 border-b border-outline-variant/60">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm select-none">
              D+
            </div>
            <span className="font-black tracking-tight text-on-surface">DESK+</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.key}
                to={l.to}
                className={({ isActive }) =>
                  `transition-colors duration-150 ${isActive
                    ? 'text-on-surface red-underline font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xs relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              className="field !h-10 !pl-9 !rounded-full !bg-surface-container-high text-sm"
              placeholder="Search furniture…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAuth ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person</span>
                  <span className="hidden xl:block">{user?.name.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
              >
                Sign in
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Open cart"
            >
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 22 }}>shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold grid place-items-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Explore Spaces CTA */}
            <Link
              to="/spaces"
              className="hidden sm:block btn-grad font-semibold px-4 py-2 rounded-xl text-sm whitespace-nowrap"
            >
              Explore Spaces
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-surface-container-high"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-outline-variant/60 bg-surface-container-low px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                className="text-sm font-medium text-on-surface-variant py-2"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="relative mt-2">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>search</span>
              <input
                className="field !h-10 !pl-9"
                placeholder="Search…"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </form>
            {isAuth ? (
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                <Link to="/account" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>My Account</Link>
                <button onClick={logout} className="text-sm text-primary font-medium">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-primary" onClick={() => setMenuOpen(false)}>Sign in</Link>
            )}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
