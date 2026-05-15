import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../api'

const MEDAL_COLORS = ['#fbbf24', '#9ca3af', '#d97706']
const MEDAL_LABELS = ['Gold', 'Silver', 'Bronze']

export default function AdminSellers() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats().then((r) => r.data),
  })

  const sellers: any[] = stats?.seller_rankings ?? []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton rounded-lg" />
        <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map((n) => <div key={n} className="h-40 skeleton rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Rankings</p>
        <h1 className="h-display text-4xl">SELLERS</h1>
      </div>

      {/* Podium */}
      {sellers.length >= 3 && (
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[1, 0, 2].map((i) => {
            const s = sellers[i]
            if (!s) return <div key={i} />
            const isFirst = i === 0
            return (
              <div
                key={s.id ?? i}
                className={`bg-surface-container-lowest rounded-2xl shadow-ambient p-6 text-center transition-all ${isFirst ? 'ring-2 ring-primary scale-105' : ''}`}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 grid place-items-center mx-auto mb-3" style={{ border: `2px solid ${MEDAL_COLORS[i]}` }}>
                  <span className="h-display text-2xl text-primary">{(s.name ?? s.email ?? 'S')?.charAt(0)}</span>
                </div>
                <p className="font-black text-base">{s.name ?? '—'}</p>
                <p className="text-xs text-on-surface-variant mb-3">{s.email ?? ''}</p>
                <div
                  className="inline-flex items-center gap-1 chip uppercase text-[10px]"
                  style={{ background: `${MEDAL_COLORS[i]}22`, color: MEDAL_COLORS[i] }}
                >
                  {MEDAL_LABELS[i]} · #{i + 1}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="h-display text-lg">{(s.total_revenue ?? 0).toLocaleString()}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">Revenue MAD</p>
                  </div>
                  <div>
                    <p className="h-display text-lg">{s.total_orders ?? s.product_count ?? 0}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">Orders</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant border-b border-outline-variant/60">
              <th className="text-left px-4 py-3">Rank</th>
              <th className="text-left px-4 py-3">Seller</th>
              <th className="text-right px-4 py-3">Products</th>
              <th className="text-right px-4 py-3">Orders</th>
              <th className="text-right px-4 py-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sellers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-on-surface-variant">No seller data available yet</td></tr>
            ) : sellers.map((s: any, i: number) => (
              <tr key={s.id ?? i} className="border-b border-outline-variant/40 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3">
                  <span
                    className="w-7 h-7 rounded-full grid place-items-center font-black text-xs"
                    style={i < 3 ? { background: `${MEDAL_COLORS[i]}22`, color: MEDAL_COLORS[i] } : { background: '#f0eded', color: '#916f6a' }}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 grid place-items-center shrink-0">
                      <span className="text-xs font-bold text-primary">{(s.name ?? 'S')?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{s.name ?? '—'}</p>
                      <p className="text-xs text-on-surface-variant">{s.email ?? ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">{s.product_count ?? 0}</td>
                <td className="px-4 py-3 text-right">{s.total_orders ?? 0}</td>
                <td className="px-4 py-3 text-right font-bold text-primary">{(s.total_revenue ?? 0).toLocaleString()} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
