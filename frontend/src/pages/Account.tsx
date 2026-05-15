import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../api'
import { useAuthStore } from '../store/authStore'
import type { Order } from '../types'

const STATUS_CLASS: Record<string, string> = {
  pending:   'badge-pending',
  preparing: 'badge-preparing',
  shipped:   'badge-shipped',
  delivered: 'badge-delivered',
  cancelled: 'badge-cancelled',
}

const TABS = ['Overview', 'My Orders', 'Settings']

export default function Account() {
  const [tab, setTab] = useState('Overview')
  const { user, logout } = useAuthStore()

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list().then((r) => r.data),
  })

  const orders = ordersData?.data ?? []

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-12">
      <div className="grid grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-primary/10 grid place-items-center mb-3 border-2 border-primary">
                <span className="h-display text-2xl text-primary">{user?.name.charAt(0)}</span>
              </div>
              <p className="font-bold">{user?.name}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">{user?.email}</p>
              <span className="chip bg-surface-container-high text-on-surface-variant mt-2 capitalize">{user?.role}</span>
            </div>

            <nav className="space-y-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${tab === t ? 'bg-primary/8 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {t === 'Overview' ? 'grid_view' : t === 'My Orders' ? 'receipt_long' : 'settings'}
                  </span>
                  {t}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors text-left"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <div className="col-span-12 lg:col-span-9">

          {/* Overview */}
          {tab === 'Overview' && (
            <div>
              <h2 className="h-display text-3xl mb-6">OVERVIEW</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: orders.length, icon: 'receipt_long' },
                  { label: 'Total Spent', value: `${orders.reduce((s, o) => s + o.total, 0).toLocaleString()} MAD`, icon: 'payments' },
                  { label: 'Member Since', value: new Date().getFullYear().toString(), icon: 'calendar_today' },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-container-lowest rounded-xl shadow-ambient p-5">
                    <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: 24 }}>{s.icon}</span>
                    <p className="h-display text-2xl">{s.value}</p>
                    <p className="text-xs text-on-surface-variant">{s.label}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-bold mb-4">Recent Orders</h3>
              {orders.slice(0, 3).map((o: Order) => (
                <div key={o.id} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl mb-3 shadow-ambient">
                  <div>
                    <p className="font-mono font-bold text-sm text-primary">#DK-{String(o.id).padStart(5, '0')}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`chip ${STATUS_CLASS[o.status] ?? 'badge-pending'} capitalize`}>{o.status}</span>
                  <p className="font-black">{o.total.toLocaleString()} MAD</p>
                  <Link to={`/orders/${o.id}`} className="text-sm text-primary font-semibold hover:underline">Track</Link>
                </div>
              ))}
            </div>
          )}

          {/* My Orders */}
          {tab === 'My Orders' && (
            <div>
              <h2 className="h-display text-3xl mb-6">MY ORDERS</h2>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 56 }}>receipt_long</span>
                  <p className="font-bold">No orders yet</p>
                  <Link to="/products" className="btn-grad px-6 py-2.5 rounded-xl font-bold text-sm">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o: Order) => (
                    <div key={o.id} className="bg-surface-container-lowest rounded-xl shadow-ambient p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="font-mono font-bold text-primary">#DK-{String(o.id).padStart(5, '0')}</p>
                          <p className="text-xs text-on-surface-variant">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`chip capitalize ${STATUS_CLASS[o.status] ?? 'badge-pending'}`}>{o.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-black">{o.total.toLocaleString()} MAD</p>
                        <Link to={`/orders/${o.id}`} className="btn-grad px-4 py-2 rounded-xl text-xs font-bold">
                          Track Order →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {tab === 'Settings' && (
            <div>
              <h2 className="h-display text-3xl mb-6">SETTINGS</h2>
              <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-8 space-y-5">
                {[['Full Name', user?.name ?? ''], ['Email', user?.email ?? ''], ['Phone', user?.phone ?? '']].map(([label, val]) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">{label}</label>
                    <input className="field" defaultValue={val} />
                  </div>
                ))}
                <button className="btn-grad px-8 py-3 rounded-xl font-bold text-sm">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
