import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const STATUS_COLORS = ['#fbbf24', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444']
const STATUSES = ['Pending', 'Preparing', 'Shipped', 'Delivered', 'Cancelled']

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats().then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map((n) => <div key={n} className="h-28 skeleton rounded-xl" />)}
        </div>
      </div>
    )
  }

  const kpis = [
    { label: 'Total Revenue',    value: `${(stats?.total_revenue ?? 0).toLocaleString()} MAD`, icon: 'payments',     trend: '+12%' },
    { label: 'Total Orders',     value: stats?.total_orders   ?? 0,                             icon: 'receipt_long', trend: '+8%'  },
    { label: 'Total Users',      value: stats?.total_users    ?? 0,                             icon: 'group',        trend: '+5%'  },
    { label: 'Avg Order Value',  value: `${(stats?.avg_order_value ?? 0).toLocaleString()} MAD`, icon: 'trending_up', trend: '+3%'  },
  ]

  const monthlyRevenue = stats?.monthly_revenue ?? []
  const ordersByStatus = stats?.orders_by_status ?? {}
  const statusData = Object.entries(ordersByStatus).map(([name, value], i) => ({ name: STATUSES[i] ?? name, value, color: STATUS_COLORS[i] }))
  const topProducts   = stats?.top_products ?? []

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Overview</p>
        <h1 className="h-display text-4xl">DASHBOARD</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-surface-container-lowest rounded-xl shadow-ambient p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>{k.icon}</span>
              <span className="chip bg-green-50 text-green-700 text-[10px]">{k.trend}</span>
            </div>
            <p className="h-display text-2xl">{k.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient p-6">
          <p className="font-bold mb-5">Monthly Revenue</p>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyRevenue} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ba0a0d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ba0a0d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()} MAD`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#ba0a0d" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-on-surface-variant text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Orders by status */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient p-6">
          <p className="font-bold mb-5">Orders by Status</p>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {statusData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span>{s.name}</span>
                    </div>
                    <span className="font-bold">{String(s.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-on-surface-variant text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-6">
          <p className="font-bold mb-4">Top Selling Products</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">
                <th className="text-left pb-3 pr-4">#</th>
                <th className="text-left pb-3">Product</th>
                <th className="text-right pb-3">Units Sold</th>
                <th className="text-right pb-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.slice(0, 5).map((p: any, i: number) => (
                <tr key={i} className="border-t border-outline-variant/40">
                  <td className="py-3 pr-4 text-on-surface-variant">{i + 1}</td>
                  <td className="py-3 font-medium">{p.name}</td>
                  <td className="py-3 text-right">{p.units_sold}</td>
                  <td className="py-3 text-right font-bold text-primary">{(p.revenue ?? 0).toLocaleString()} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
