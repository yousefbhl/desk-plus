import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { sellerApi } from '../api'

const STATUS_CHIP: Record<string, string> = {
  pending:   'bg-red-100 text-primary',
  preparing: 'bg-blue-100 text-blue-700',
  shipping:  'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n || 0))

export default function SellerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['seller-dashboard'],
    queryFn: sellerApi.dashboard,
  })

  const k = data?.kpis
  const firstName = data?.seller_name?.split(' ')[0] ?? ''
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div>
      {/* Hero */}
      <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-xl p-8 mb-6">
        <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">{today}</p>
        <h1 className="h-display text-4xl">Salam, {firstName || 'Seller'}.</h1>
        <p className="text-on-surface-variant mt-2">
          {isLoading
            ? 'Loading your atelier…'
            : <>You have <strong className="text-primary">{k?.units ?? 0} units sold</strong> all-time
              {k?.low_stock ? <> · <strong className="text-amber-700">{k.low_stock} low on stock</strong></> : null}.</>}
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/seller/products" className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2">Manage products</Link>
          <Link to="/seller/orders" className="border border-outline-variant font-semibold px-5 py-2.5 rounded-xl text-sm">View orders</Link>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiTile label="Sales · all-time" value={`${fmt(k?.revenue ?? 0)}`} unit="MAD" loading={isLoading} />
        <KpiTile label="Units sold" value={fmt(k?.units ?? 0)} loading={isLoading} />
        <KpiTile label="Active listings" value={fmt(k?.active ?? 0)} sub={k?.low_stock ? `${k.low_stock} low stock` : undefined} subClass="text-amber-700" loading={isLoading} />
        <KpiTile label="Avg. rating" value={`${k?.avg_rating ?? 0}`} unit="★" sub={`${fmt(k?.reviews ?? 0)} reviews`} loading={isLoading} />
      </div>

      {/* Orders to fulfill + hero piece */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-outline-variant">
            <h2 className="h-display text-lg">Orders to fulfill</h2>
            <Link to="/seller/orders" className="text-sm font-bold text-primary">All orders →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant bg-surface-container-low">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left py-3">Customer</th>
                <th className="text-left py-3">Piece</th>
                <th className="text-right py-3">Qty</th>
                <th className="text-right py-3">Earnings</th>
                <th className="text-left py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-surface-container-high rounded animate-pulse" /></td></tr>
                ))
              ) : (data?.recent_orders?.length ?? 0) === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-on-surface-variant">No orders yet</td></tr>
              ) : data.recent_orders.map((o: any, i: number) => (
                <tr key={i}>
                  <td className="px-5 py-3 font-mono font-bold text-primary">{o.reference}</td>
                  <td>{o.customer ?? 'Guest'}</td>
                  <td>{o.piece}</td>
                  <td className="text-right font-bold">{o.qty}</td>
                  <td className="text-right font-black">{fmt(o.earnings)} MAD</td>
                  <td className="px-5"><span className={`chip capitalize ${STATUS_CHIP[o.status] ?? 'bg-surface-container-high'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hero piece */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-ambient">
          <h2 className="h-display text-lg mb-4">Hero piece</h2>
          {isLoading ? (
            <div className="aspect-square bg-surface-container-high rounded-xl animate-pulse" />
          ) : data?.hero ? (
            <>
              <div className="aspect-square rounded-xl mb-4 relative bg-surface-container-high grid place-items-center overflow-hidden">
                <span className="absolute top-3 left-3 chip btn-grad text-white uppercase tracking-widest-2">Top seller</span>
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>chair</span>
              </div>
              <div className="font-bold mt-1">{data.hero.name}</div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <MiniStat label="Sold" value={fmt(data.hero.sold)} />
                <MiniStat label="Stock" value={fmt(data.hero.stock)} />
                <MiniStat label="★" value={data.hero.avg_rating ?? 0} />
              </div>
              <div className="mt-3 text-2xl font-black text-primary">{fmt(data.hero.earned)} MAD <span className="text-xs text-on-surface-variant font-normal">earned</span></div>
            </>
          ) : (
            <p className="text-sm text-on-surface-variant py-8 text-center">No sales data yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiTile({ label, value, unit, sub, subClass, loading }: { label: string; value: string; unit?: string; sub?: string; subClass?: string; loading?: boolean }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient">
      <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">{label}</div>
      {loading ? (
        <div className="h-8 w-24 bg-surface-container-high rounded animate-pulse mt-2" />
      ) : (
        <div className="text-3xl font-black mt-1">{value} {unit && <span className="text-base">{unit}</span>}</div>
      )}
      {sub && <div className={`text-xs mt-1 ${subClass ?? 'text-on-surface-variant'}`}>{sub}</div>}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-2">
      <div className="text-on-surface-variant uppercase tracking-widest-2">{label}</div>
      <div className="font-black text-base">{value}</div>
    </div>
  )
}