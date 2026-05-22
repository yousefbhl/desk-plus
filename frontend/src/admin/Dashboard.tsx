import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminStats, useAdminOrders } from '../hooks/useAdmin'
import { useAuthStore } from '../store/authStore'

function formatNum(n: number | undefined | null): string {
  if (n == null) return '0'
  if (n >= 1000) return `${Math.round(n / 1000).toLocaleString()}K`
  return n.toLocaleString()
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const STATUS_CHIP: Record<string, string> = {
  pending:    'bg-red-100 text-primary',
  processing: 'bg-blue-100 text-blue-700',
  preparing:  'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  shipping:   'bg-purple-100 text-purple-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-gray-200 text-gray-700',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'New',
  processing: 'Preparing',
  preparing: 'Preparing',
  shipped: 'Shipped',
  shipping: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function Dashboard() {
  const { data: stats, isLoading } = useAdminStats()
  const { data: ordersData } = useAdminOrders({ per_page: 5 })
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders' | 'visitors'>('revenue')
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set())

  const toggleTask = (idx: number) => {
    setCompletedTasks(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const overview = (stats as any)?.overview ?? {}
  const sellerRankings: any[] = (stats as any)?.seller_rankings ?? []
  const ordersByStatus: Record<string, number> = (stats as any)?.orders_by_status ?? {}
  const recentOrders: any[] = ordersData?.data ?? []

  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const pendingCount = overview.pending_orders ?? ordersByStatus.pending ?? 0

  const phColors = ['ph-walnut', 'ph-charcoal', 'ph-warm', 'ph-wood', 'ph-cream']
  const rankBg = ['bg-primary', 'bg-on-surface', 'bg-on-surface-variant']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Hero greeting */}
      <div className="bg-[#1c1b1b] text-white rounded-xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-7">
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">{dayName} · {monthDay}</p>
            <h1 className="h-display text-4xl">{greeting}, {user?.name?.split(' ')[0] ?? 'Admin'}.</h1>
            <p className="text-white/60 mt-2">{pendingCount} pending order{pendingCount !== 1 ? 's' : ''}, {overview.total_sellers ?? 0} active sellers, and {overview.total_orders ?? 0} total orders.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/admin/orders" className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>priority_high</span>Review {pendingCount} orders</Link>
              <Link to="/admin/sellers" className="border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/10">View sellers</Link>
            </div>
          </div>
          <div className="col-span-5 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/5 rounded-xl p-4"><div className="text-[10px] uppercase tracking-widest-2 text-white/50">Revenue</div><div className="text-2xl font-black mt-1">{formatNum(overview.total_revenue)}</div><div className="text-[10px] text-emerald-400 font-bold">MAD</div></div>
            <div className="bg-white/5 rounded-xl p-4"><div className="text-[10px] uppercase tracking-widest-2 text-white/50">Orders</div><div className="text-2xl font-black mt-1">{overview.total_orders ?? 0}</div><div className="text-[10px] text-emerald-400 font-bold">total</div></div>
            <div className="bg-white/5 rounded-xl p-4"><div className="text-[10px] uppercase tracking-widest-2 text-white/50">Customers</div><div className="text-2xl font-black mt-1">{(overview.total_users ?? 0).toLocaleString()}</div><div className="text-[10px] text-emerald-400 font-bold">registered</div></div>
          </div>
        </div>
        <svg className="absolute -right-10 -bottom-10 w-72 h-72 opacity-10" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="#ba0a0d" strokeWidth=".5" />
          <circle cx="50" cy="50" r="34" stroke="#ba0a0d" strokeWidth=".5" />
          <circle cx="50" cy="50" r="20" stroke="#ba0a0d" strokeWidth=".5" />
        </svg>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl btn-grad text-white grid place-items-center"><span className="material-symbols-outlined">payments</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">Total</span>
          </div>
          <div className="text-3xl font-black mt-4">{formatNum(overview.total_revenue)} <span className="text-base">MAD</span></div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Revenue</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">receipt_long</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">{pendingCount} pending</span>
          </div>
          <div className="text-3xl font-black mt-4">{overview.total_orders ?? 0}</div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Orders</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">group_add</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">registered</span>
          </div>
          <div className="text-3xl font-black mt-4">{(overview.total_users ?? 0).toLocaleString()}</div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Customers</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">trending_up</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">avg</span>
          </div>
          <div className="text-3xl font-black mt-4">{(overview.avg_order ?? 0).toLocaleString()}</div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Avg. order · MAD</div>
        </div>
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Sales chart */}
        <div className="col-span-8 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div><h2 className="h-display text-lg">Revenue · last 14 days</h2><div className="text-xs text-on-surface-variant">Compared to previous fortnight</div></div>
            <div className="flex gap-2">
              <button onClick={() => setActiveMetric('revenue')} className={`chip ${activeMetric === 'revenue' ? 'btn-grad' : 'bg-surface-container-high'} uppercase tracking-widest-2`}>Revenue</button>
              <button onClick={() => setActiveMetric('orders')} className={`chip ${activeMetric === 'orders' ? 'btn-grad' : 'bg-surface-container-high'} uppercase tracking-widest-2`}>Orders</button>
              <button onClick={() => setActiveMetric('visitors')} className={`chip ${activeMetric === 'visitors' ? 'btn-grad' : 'bg-surface-container-high'} uppercase tracking-widest-2`}>Visitors</button>
            </div>
          </div>
          <svg viewBox="0 0 800 240" className="w-full">
            <defs>
              <linearGradient id="fillRev" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ba0a0d" stopOpacity=".25" />
                <stop offset="100%" stopColor="#ba0a0d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="#e5e2e1" strokeDasharray="2 4">
              <line x1="0" y1="40" x2="800" y2="40" /><line x1="0" y1="100" x2="800" y2="100" /><line x1="0" y1="160" x2="800" y2="160" /><line x1="0" y1="220" x2="800" y2="220" />
            </g>
            <g fill="#9c9c9c" fontSize="10" fontFamily="Inter">
              <text x="4" y="44">50K</text><text x="4" y="104">35K</text><text x="4" y="164">20K</text><text x="4" y="224">5K</text>
            </g>
            {/* Prior period */}
            <polyline fill="none" stroke="#d6d2d0" strokeWidth="2" strokeDasharray="4 4"
              points="60,170 110,160 160,150 210,155 260,140 310,135 360,125 410,130 460,120 510,110 560,115 610,100 660,95 710,90" />
            {/* Current */}
            <path d="M60,150 L110,140 L160,120 L210,130 L260,110 L310,100 L360,80 L410,90 L460,70 L510,60 L560,75 L610,55 L660,40 L710,30 L710,240 L60,240 Z" fill="url(#fillRev)" />
            <polyline fill="none" stroke="#ba0a0d" strokeWidth="2.5"
              points="60,150 110,140 160,120 210,130 260,110 310,100 360,80 410,90 460,70 510,60 560,75 610,55 660,40 710,30" />
            <g fill="#ba0a0d">
              <circle cx="710" cy="30" r="5" />
            </g>
          </svg>
          <div className="flex justify-between text-xs text-on-surface-variant mt-1 px-12"><span>2 weeks ago</span><span></span><span></span><span>Today</span></div>
        </div>

        {/* Activity feed */}
        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="h-display text-lg">Orders by status</h2>
          </div>
          <div className="space-y-4 text-sm">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full grid place-items-center flex-shrink-0 ${STATUS_CHIP[status] ?? 'bg-gray-200 text-gray-700'}`}>
                  <span className="material-symbols-outlined" style={{fontSize:18}}>
                    {status === 'pending' ? 'schedule' : status === 'delivered' ? 'check_circle' : status === 'cancelled' ? 'cancel' : 'local_shipping'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-bold capitalize">{status}</div>
                </div>
                <div className="text-2xl font-black">{count}</div>
              </div>
            ))}
            {Object.keys(ordersByStatus).length === 0 && (
              <div className="text-on-surface-variant text-center py-4">No order data</div>
            )}
          </div>
          <Link to="/admin/orders" className="block mt-5 pt-4 border-t border-outline-variant text-center text-sm font-bold text-primary">All orders &rarr;</Link>
        </div>
      </div>

      {/* 3-col bottom row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Today's tasks */}
        <div className="col-span-5 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Quick stats</h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-red-50 cursor-pointer" onClick={() => toggleTask(0)}>
              <span className={`ck${completedTasks.has(0) ? ' on' : ''}`}><span className="material-symbols-outlined" style={{fontSize:14}}>priority_high</span></span>
              <div className="flex-1"><div className={`font-bold ${completedTasks.has(0) ? 'line-through opacity-50' : ''}`}>Review {pendingCount} pending orders</div><div className="text-xs text-on-surface-variant">Confirm payment &amp; dispatch</div></div>
              <span className="chip bg-primary text-white">Urgent</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant cursor-pointer" onClick={() => toggleTask(1)}>
              <span className={`ck${completedTasks.has(1) ? ' on' : ''}`}></span>
              <div className="flex-1"><div className={`font-semibold ${completedTasks.has(1) ? 'line-through opacity-50' : ''}`}>{overview.total_sellers ?? 0} active sellers</div><div className="text-xs text-on-surface-variant">Managing products on the platform</div></div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant cursor-pointer" onClick={() => toggleTask(2)}>
              <span className={`ck${completedTasks.has(2) ? ' on' : ''}`}></span>
              <div className="flex-1"><div className={`font-semibold ${completedTasks.has(2) ? 'line-through opacity-50' : ''}`}>{overview.total_users ?? 0} registered customers</div><div className="text-xs text-on-surface-variant">Growing your customer base</div></div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant cursor-pointer" onClick={() => toggleTask(3)}>
              <span className={`ck${completedTasks.has(3) ? ' on' : ''}`}></span>
              <div className="flex-1"><div className={`font-semibold ${completedTasks.has(3) ? 'line-through opacity-50' : ''}`}>{(overview.total_revenue ?? 0).toLocaleString()} MAD total revenue</div><div className="text-xs text-on-surface-variant">Across all paid orders</div></div>
            </label>
          </div>
        </div>

        {/* Top sellers */}
        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Top ateliers</h2>
          <div className="space-y-4 text-sm">
            {sellerRankings.slice(0, 4).map((seller: any, i: number) => (
              <div key={seller.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${phColors[i % phColors.length]} relative`}>
                  {i < 3 && (
                    <span className={`absolute -top-1 -left-1 w-5 h-5 ${rankBg[i]} text-white rounded-full text-[10px] font-black grid place-items-center`}>{i + 1}</span>
                  )}
                </div>
                <div className="flex-1"><div className="font-bold">{seller.name}</div><div className="text-xs text-on-surface-variant">{seller.products_count} SKUs</div></div>
                <div className="font-black">{formatNum(seller.revenue)}</div>
              </div>
            ))}
            {sellerRankings.length === 0 && (
              <div className="text-on-surface-variant text-center py-4">No seller data</div>
            )}
          </div>
          <Link to="/admin/sellers" className="block mt-5 pt-4 border-t border-outline-variant text-center text-sm font-bold text-primary">All sellers &rarr;</Link>
        </div>

        {/* Summary */}
        <div className="col-span-3 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Platform summary</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-red-50 border-l-4 border-primary">
              <div className="text-[10px] font-bold uppercase tracking-widest-2 text-primary">Pending orders</div>
              <div className="font-bold mt-0.5">{pendingCount} orders</div>
              <div className="text-xs text-on-surface-variant">Awaiting action</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border-l-4 border-emerald-500">
              <div className="text-[10px] font-bold uppercase tracking-widest-2 text-emerald-700">Delivered</div>
              <div className="font-bold mt-0.5">{ordersByStatus.delivered ?? 0} orders</div>
              <div className="text-xs text-on-surface-variant">Successfully completed</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
              <div className="text-[10px] font-bold uppercase tracking-widest-2 text-blue-700">Sellers</div>
              <div className="font-bold mt-0.5">{overview.total_sellers ?? 0} active</div>
              <div className="text-xs text-on-surface-variant">Partner ateliers</div>
            </div>
          </div>
          <Link to="/admin/products" className="block mt-4 text-center text-sm font-bold text-primary">View products &rarr;</Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="h-display text-lg">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-bold text-primary">All orders &rarr;</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant bg-surface-container-low">
            <tr><th className="text-left px-6 py-3">Order</th><th className="text-left py-3">Customer</th><th className="text-left py-3">Items</th><th className="text-right py-3">Total</th><th className="text-left py-3">Status</th><th className="px-6"></th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {recentOrders.map((order: any) => (
              <tr key={order.id}>
                <td className="px-6 py-3 font-mono font-bold text-primary">#{order.reference ?? `DK-${String(order.id).padStart(5, '0')}`}</td>
                <td className="font-semibold">{order.user?.name ?? 'Customer'}</td>
                <td>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</td>
                <td className="text-right font-black">{(order.total ?? 0).toLocaleString()} MAD</td>
                <td><span className={`chip ${STATUS_CHIP[order.status] ?? 'bg-gray-200 text-gray-700'}`}>{STATUS_LABEL[order.status] ?? order.status}</span></td>
                <td className="px-6"><button onClick={() => navigate(`/orders/${order.id}`)} className="text-primary font-bold text-xs">View &rarr;</button></td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
