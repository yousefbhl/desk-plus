import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import ToastContainer from '../ui/Toast'

const NAV = [
  { to: '/seller',          label: 'Dashboard',  icon: 'dashboard',              exact: true },
  { to: '/seller/products', label: 'My Products', icon: 'inventory_2'                        },
  { to: '/seller/orders',   label: 'Commandes',   icon: 'receipt_long'                       },
  { to: '/seller/stats',    label: 'Statistics',  icon: 'analytics'                          },
]

const PAGE_LABELS: Record<string, string> = {
  '/seller':          'Dashboard',
  '/seller/products': 'My Products',
  '/seller/orders':   'Commandes',
  '/seller/stats':    'Statistics',
}

export default function SellerLayout() {
  const { user, logout } = useAuthStore()
  const { pathname }     = useLocation()
  const crumb = PAGE_LABELS[pathname] ?? 'Atelier'

  return (
    <div className="min-h-screen flex" style={{ background: '#f6f4ef' }}>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#fcf9f8] border-r border-outline-variant p-5 z-30 flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-grad grid place-items-center text-white font-black text-sm">D+</div>
          <div>
            <div className="font-black tracking-tight text-sm">DESK+</div>
            <div className="text-[10px] text-on-surface-variant -mt-0.5 uppercase tracking-widest-2">Atelier</div>
          </div>
        </div>

        {/* Seller card */}
        <div className="mt-8 p-4 rounded-xl bg-[#1c1b1b] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg ph-walnut shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{user?.name ?? 'Atelier'}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-widest-2">Seller</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/60">Verified</span>
            <span className="material-symbols-outlined ms-fill text-amber-400" style={{ fontSize: 18 }}>verified</span>
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant mt-8 mb-3">Manage</div>

        <nav className="space-y-1 text-sm flex-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-fixed text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="border-t border-outline-variant pt-4 mt-4 flex items-center gap-3 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          Sign out
        </button>
      </aside>

      {/* Main area */}
      <div className="ml-[240px] flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-outline-variant px-8 h-16 flex items-center sticky top-0 z-20">
          <div className="text-xs text-on-surface-variant">
            <span className="hover:text-on-surface cursor-default">Atelier</span>
            <span className="mx-1">/</span>
            <span className="font-semibold text-on-surface">{crumb}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs text-on-surface-variant">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
            <div className="h-6 w-px bg-outline-variant" />
            <NavLink to="/seller/products" className="btn-grad font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              New product
            </NavLink>
          </div>
        </header>

        <main className="flex-1 p-8 bg-surface min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
