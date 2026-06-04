import { useQuery } from '@tanstack/react-query'
import { sellerApi } from '../api'

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n || 0))

export default function SellerStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['seller-stats'],
    queryFn: sellerApi.stats,
  })

  const top = data?.top_products ?? []
  const maxRev = Math.max(...top.map((p: any) => Number(p.revenue) || 0), 1)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="h-display text-3xl">Statistics</h1>
          <p className="text-sm text-on-surface-variant">Your atelier's pulse — all-time</p>
        </div>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Net revenue" value={fmt(data?.revenue ?? 0)} unit="MAD" icon="payments" loading={isLoading} />
        <StatCard label="Units sold" value={fmt(data?.units_sold ?? 0)} icon="inventory_2" loading={isLoading} />
        <StatCard label="Avg. order value" value={fmt(data?.avg_order ?? 0)} unit="MAD" icon="shopping_bag" loading={isLoading} />
        <StatCard label="Avg. rating" value={`${data?.avg_rating ?? 0}`} unit="★" icon="star" loading={isLoading} />
      </div>

      {/* Top products */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="h-display text-lg mb-4">Your top pieces</h3>
          {isLoading ? (
            <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-surface-container-high rounded animate-pulse" />)}</div>
          ) : top.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {top.map((p: any, i: number) => {
                const rankBg = i === 0 ? 'bg-primary' : i === 1 ? 'bg-on-surface' : 'bg-on-surface-variant'
                const width = `${Math.round((Number(p.revenue) / maxRev) * 100)}%`
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high relative grid place-items-center shrink-0">
                      <span className={`absolute -top-1 -left-1 w-5 h-5 ${rankBg} text-white rounded-full text-[10px] font-black grid place-items-center`}>{i + 1}</span>
                      <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chair</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{p.name}</div>
                      <div className="text-xs text-on-surface-variant">{fmt(p.sold)} sold</div>
                      <div className="mt-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width }} /></div>
                    </div>
                    <div className="font-black text-sm">{fmt(p.revenue)}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Summary side card */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
          <h3 className="h-display text-lg mb-4">At a glance</h3>
          <div className="grid grid-cols-2 gap-4">
            <Glance label="Total orders" value={fmt(data?.orders_count ?? 0)} loading={isLoading} />
            <Glance label="Reviews" value={fmt(data?.reviews ?? 0)} loading={isLoading} />
            <Glance label="Units sold" value={fmt(data?.units_sold ?? 0)} loading={isLoading} />
            <Glance label="Avg rating" value={`${data?.avg_rating ?? 0} ★`} loading={isLoading} />
          </div>
          <div className="mt-5 pt-5 border-t border-outline-variant">
            <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant">Net revenue (all-time)</div>
            <div className="text-3xl font-black text-primary mt-1">{fmt(data?.revenue ?? 0)} MAD</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, icon, loading }: { label: string; value: string; unit?: string; icon: string; loading?: boolean }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">{label}</div>
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>{icon}</span>
      </div>
      {loading
        ? <div className="h-8 w-24 bg-surface-container-high rounded animate-pulse mt-3" />
        : <div className="text-3xl font-black mt-3">{value} {unit && <span className="text-base">{unit}</span>}</div>}
    </div>
  )
}

function Glance({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant">{label}</div>
      {loading ? <div className="h-6 w-16 bg-surface-container-high rounded animate-pulse mt-1" /> : <div className="text-xl font-black mt-0.5">{value}</div>}
    </div>
  )
}