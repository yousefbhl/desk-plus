import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMyOrders } from '../hooks/useOrders'

export default function Account() {
  const { user, logout } = useAuthStore()
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders()
  const orders = ordersData?.data ?? []

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const statusClasses: Record<string, string> = {
    pending:    'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-emerald-100 text-emerald-700',
    cancelled:  'bg-red-100 text-red-700',
  }

  return (
    <section className="max-w-screen-2xl mx-auto px-8 py-10">
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="col-span-3">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-surface-container-high border-2 border-primary grid place-items-center font-black text-2xl">{initials}</div>
            <div className="font-bold mt-3">{user?.name ?? 'Guest'}</div>
            <div className="text-xs text-on-surface-variant">{user?.email ?? ''}</div>
            <div className="chip bg-primary-fixed text-primary mt-3 mx-auto inline-flex">Premium member</div>
          </div>
          <nav className="mt-4 bg-surface-container-lowest rounded-xl p-3 shadow-ambient text-sm">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-container-high border-l-4 border-primary text-primary font-bold"><span className="material-symbols-outlined">dashboard</span>Overview</a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined">receipt_long</span>My Orders <span className="ml-auto text-xs text-on-surface-variant">{orders.length}</span></a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined">favorite</span>Wishlist <span className="ml-auto text-xs text-on-surface-variant">8</span></a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined">home_work</span>Saved Addresses</a>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined">settings</span>Profile Settings</a>
            <div className="h-px bg-outline-variant my-2"></div>
            <button onClick={() => logout()} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary font-semibold hover:bg-surface-container-low w-full"><span className="material-symbols-outlined">logout</span>Logout</button>
          </nav>
        </aside>

        {/* Main */}
        <div className="col-span-9">
          <h1 className="h-display text-4xl">Welcome back, {user?.name?.split(' ')[0] ?? 'there'}.</h1>
          <p className="text-on-surface-variant mt-1">Here's what's happening with your account today.</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 mt-8">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Total Orders</div>
              <div className="text-4xl font-black mt-2">{orders.length}</div>
              <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>+3 this quarter</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Wishlist Items</div>
              <div className="text-4xl font-black mt-2">8</div>
              <div className="text-xs text-on-surface-variant mt-1">2 on sale right now</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border-2 border-primary">
              <div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Points Earned</div>
              <div className="text-4xl font-black mt-2 text-primary">1,842</div>
              <div className="text-xs text-on-surface-variant mt-1">158 to next tier</div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="mt-10 bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="h-display text-lg">Recent orders</h2>
              <a className="text-sm font-semibold text-primary">View all →</a>
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>progress_activity</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant text-sm">No orders yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
                  <tr className="bg-surface-container-low"><th className="text-left px-6 py-3">Order</th><th className="text-left py-3">Items</th><th className="text-left py-3">Status</th><th className="text-left py-3">Date</th><th className="text-right py-3 px-6">Total</th></tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id} className={idx % 2 === 1 ? 'bg-surface-container-low' : ''}>
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        <Link to={`/orders/${order.id}`}>#{order.reference ?? `DK-${String(order.id).padStart(5, '0')}`}</Link>
                      </td>
                      <td>
                        <div className="flex">
                          {(order.items ?? []).slice(0, 3).map((item, i) => (
                            <div key={item.id} className={`w-9 h-9 rounded-lg bg-surface-container-high border-2 border-white grid place-items-center text-[10px] font-bold text-on-surface-variant${i < 2 ? ' -mr-2' : ''}`}>
                              {item.product_name.charAt(0)}
                            </div>
                          ))}
                          {(order.items?.length ?? 0) > 3 && (
                            <div className="w-9 h-9 rounded-lg bg-surface-container-high border-2 border-white grid place-items-center text-[10px] font-bold text-on-surface-variant">+{(order.items?.length ?? 0) - 3}</div>
                          )}
                        </div>
                      </td>
                      <td><span className={`chip ${statusClasses[order.status.toLowerCase()] ?? 'bg-gray-100 text-gray-700'}`}>{order.status}</span></td>
                      <td className="text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="text-right px-6 font-black">{order.total.toLocaleString()} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-5 mt-8">
            <Link to="/order-tracking" className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:-translate-y-0.5 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl btn-grad text-white grid place-items-center"><span className="material-symbols-outlined">local_shipping</span></div>
              <div><div className="font-bold">Track Order</div><div className="text-xs text-on-surface-variant">Live carrier updates</div></div>
            </Link>
            <a className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:-translate-y-0.5 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface grid place-items-center"><span className="material-symbols-outlined">rate_review</span></div>
              <div><div className="font-bold">Write a Review</div><div className="text-xs text-on-surface-variant">3 items eligible</div></div>
            </a>
            <a className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient hover:-translate-y-0.5 transition flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface grid place-items-center"><span className="material-symbols-outlined">card_giftcard</span></div>
              <div><div className="font-bold">Refer a Friend</div><div className="text-xs text-on-surface-variant">Earn 200 points</div></div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
