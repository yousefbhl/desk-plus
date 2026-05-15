import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#ba0a0d','#3b82f6','#10b981','#f59e0b','#8b5cf6']

export default function AdminReports() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats().then((r) => r.data),
  })

  const handleExport = async () => {
    const res = await adminApi.exportReport('sales', 'csv')
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = 'report.csv'; a.click()
  }

  const monthlyRevenue = stats?.monthly_revenue ?? []
  const topProducts    = stats?.top_products     ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Analytics</p>
          <h1 className="h-display text-4xl">REPORTS</h1>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 border-2 border-outline-variant px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
          Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue',   value: `${(stats?.total_revenue ?? 0).toLocaleString()} MAD`, icon: 'payments'     },
          { label: 'Total Orders',    value: stats?.total_orders ?? 0,                               icon: 'receipt_long' },
          { label: 'Total Users',     value: stats?.total_users ?? 0,                                icon: 'group'        },
          { label: 'Avg Order Value', value: `${(stats?.avg_order_value ?? 0).toLocaleString()} MAD`, icon: 'trending_up' },
        ].map((k) => (
          <div key={k.label} className="bg-surface-container-lowest rounded-xl shadow-ambient p-5">
            <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: 24 }}>{k.icon}</span>
            <p className="h-display text-2xl">{isLoading ? '—' : k.value}</p>
            <p className="text-xs text-on-surface-variant">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-6 mb-6">
        <p className="font-bold mb-5">Revenue Over Time</p>
        {monthlyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyRevenue} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ba0a0d" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#ba0a0d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()} MAD`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#ba0a0d" strokeWidth={2.5} fill="url(#rev2)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-on-surface-variant text-sm">{isLoading ? 'Loading…' : 'No revenue data yet'}</div>
        )}
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-6">
          <p className="font-bold mb-4">Top Products by Revenue</p>
          <div className="space-y-3">
            {topProducts.slice(0, 8).map((p: any, i: number) => {
              const max = topProducts[0]?.revenue ?? 1
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-on-surface-variant w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-bold text-primary">{(p.revenue ?? 0).toLocaleString()} MAD</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(((p.revenue ?? 0) / max) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
