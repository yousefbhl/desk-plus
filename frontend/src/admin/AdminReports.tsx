import { useAdminStats } from '../hooks/useAdmin'

function formatNum(n: number | undefined | null): string {
  if (n == null) return '0'
  if (n >= 1000) return `${Math.round(n / 1000).toLocaleString()}K`
  return n.toLocaleString()
}

export default function AdminReports() {
  const { data: stats, isLoading } = useAdminStats()

  const overview = (stats as any)?.overview ?? {}
  const topProducts: any[] = (stats as any)?.top_products ?? []
  const sellerRankings: any[] = (stats as any)?.seller_rankings ?? []
  const monthlyRevenue: any[] = (stats as any)?.monthly_revenue ?? []
  const ordersByStatus: Record<string, number> = (stats as any)?.orders_by_status ?? {}
  const bestSeller = (stats as any)?.best_seller
  const bestCategory = (stats as any)?.best_category

  const maxRevenue = topProducts.length > 0 ? Math.max(...topProducts.map((p: any) => Number(p.revenue) || 0)) : 1

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="h-display text-3xl">Reports</h1><p className="text-sm text-on-surface-variant">Performance overview</p></div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>file_download</span>Export PDF</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Revenue</div>
          <div className="text-3xl font-black mt-1">{formatNum(overview.total_revenue)} <span className="text-base font-bold">MAD</span></div>
          <div className="text-xs text-on-surface-variant mt-1">Total paid orders</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Orders</div>
          <div className="text-3xl font-black mt-1">{overview.total_orders ?? 0}</div>
          <div className="text-xs text-on-surface-variant mt-1">{overview.pending_orders ?? 0} pending</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Avg. order value</div>
          <div className="text-3xl font-black mt-1">{(overview.avg_order ?? 0).toLocaleString()} <span className="text-base font-bold">MAD</span></div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Sellers</div>
          <div className="text-3xl font-black mt-1">{overview.total_sellers ?? 0}</div>
          <div className="text-xs text-on-surface-variant mt-1">{overview.total_users ?? 0} customers</div>
        </div>
      </div>

      {/* Monthly revenue chart */}
      {monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="h-display text-xl">Monthly revenue</h2><p className="text-xs text-on-surface-variant">Last {monthlyRevenue.length} months</p></div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {monthlyRevenue.map((m: any, i: number) => {
              const maxRev = Math.max(...monthlyRevenue.map((x: any) => Number(x.revenue) || 0))
              const height = maxRev > 0 ? ((Number(m.revenue) || 0) / maxRev) * 100 : 0
              const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] font-bold">{formatNum(Number(m.revenue))}</div>
                  <div className="w-full btn-grad rounded-t" style={{ height: `${height}%`, minHeight: 4 }}></div>
                  <div className="text-[10px] text-on-surface-variant">{monthNames[Number(m.month)] ?? m.month}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Orders by status */}
      {Object.keys(ordersByStatus).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
          <h2 className="h-display text-xl mb-4">Orders by status</h2>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-surface-container-low rounded-xl">
                <div className="text-3xl font-black">{count}</div>
                <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1 capitalize">{status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-xl p-6 shadow-soft col-span-2">
          <h3 className="h-display text-lg mb-4">Top products</h3>
          <div className="space-y-3">
            {topProducts.map((product: any, i: number) => {
              const pct = maxRevenue > 0 ? ((Number(product.revenue) || 0) / maxRevenue) * 100 : 0
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high grid place-items-center text-xs font-black">{i + 1}</div>
                  <div className="flex-1"><div className="font-semibold text-sm">{product.product_name}</div><div className="text-xs text-on-surface-variant">{product.units_sold} sold</div></div>
                  <div className="flex-1 max-w-[200px] h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{width:`${pct}%`}}></div></div>
                  <div className="font-black text-sm w-24 text-right">{Number(product.revenue ?? 0).toLocaleString()} MAD</div>
                </div>
              )
            })}
            {topProducts.length === 0 && <div className="text-on-surface-variant text-center py-4">No product data</div>}
          </div>
        </div>

        {/* Best selling info */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h3 className="h-display text-lg mb-4">Highlights</h3>
          <div className="space-y-4 text-sm">
            {bestSeller && (
              <div className="p-4 bg-surface-container-low rounded-xl">
                <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant mb-1">Best selling product</div>
                <div className="font-bold">{bestSeller.product_name}</div>
                <div className="text-xs text-on-surface-variant">{bestSeller.units_sold} units sold</div>
              </div>
            )}
            {bestCategory && (
              <div className="p-4 bg-surface-container-low rounded-xl">
                <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant mb-1">Best category</div>
                <div className="font-bold">{bestCategory.name}</div>
                <div className="text-xs text-on-surface-variant">{bestCategory.units_sold} units sold</div>
              </div>
            )}
            <div className="p-4 bg-surface-container-low rounded-xl">
              <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant mb-1">Top sellers</div>
              {sellerRankings.slice(0, 3).map((s: any, i: number) => (
                <div key={s.id} className="flex justify-between mt-1">
                  <span className="font-semibold">{i + 1}. {s.name}</span>
                  <span className="font-black">{formatNum(s.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
