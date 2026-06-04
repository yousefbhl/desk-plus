import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import ToastContainer from '../ui/Toast'

const NAV = [
  { to: '/seller',          label: 'Dashboard',   icon: 'dashboard',    exact: true },
  { to: '/seller/products', label: 'My Products', icon: 'inventory_2'               },
  { to: '/seller/orders',   label: 'Commandes',   icon: 'receipt_long'              },
  { to: '/seller/stats',    label: 'Statistics',  icon: 'bar_chart'                 },
]

export default function SellerLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-surface-container-low">

      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col sticky top-0 h-screen">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-outline-variant">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
            <div>
              <div className="font-black tracking-tight text-sm">DESK+</div>
              <div className="text-xs text-on-surface-variant -mt-0.5">Seller Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary/8 text-primary border-l-[3px] border-primary pl-[9px]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-l-[3px] border-transparent pl-[9px]'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center">
              <span className="text-xs font-bold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-on-surface-variant truncate">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}