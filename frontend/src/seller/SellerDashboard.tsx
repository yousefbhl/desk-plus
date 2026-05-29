import { Link, useNavigate } from 'react-router-dom'
import { useSellerOrders, useSellerStats } from '../hooks/useSeller'
import { useAuthStore } from '../store/authStore'

const STATUS_CHIP: Record<string, string> = {
  pending: 'bg-red-100 text-primary',
  preparing: 'bg-blue-100 text-blue-700',
  shipping: 'bg-purple-100 text-purple-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-gray-200 text-gray-700',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Awaiting prep',
  preparing: 'In workshop',
  shipping: 'Shipped',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function money(value: number | undefined | null) {
  return `${(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} MAD`
}

function dateTime(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SellerDashboard() {
  const { data: stats, isLoading: statsLoading } = useSellerStats()
  const { data: ordersData, isLoading: ordersLoading } = useSellerOrders({ per_page: 4 })
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const recentOrders = ordersData?.data ?? []
  const topOrder = recentOrders[0]
  const firstItem = topOrder?.items?.[0]
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border-2 border-outline-variant rounded-xl p-8 mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">{dayName} · {monthDay}</p>
          <h1 className="h-display text-4xl">Salam, {user?.name?.split(' ')[0] ?? 'Seller'}.</h1>
          <p className="text-on-surface-variant mt-2">
            You have <strong className="text-primary">{stats?.pending_orders ?? 0} pending order{(stats?.pending_orders ?? 0) !== 1 ? 's' : ''}</strong>,
            {' '}{stats?.active_products ?? 0} active product{(stats?.active_products ?? 0) !== 1 ? 's' : ''}, and {stats?.low_stock_products ?? 0} low-stock item{(stats?.low_stock_products ?? 0) !== 1 ? 's' : ''}.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/seller/products" className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2">Manage products</Link>
            <Link to="/seller/orders" className="border border-outline-variant font-semibold px-5 py-2.5 rounded-xl text-sm">View orders</Link>
          </div>
        </div>
        <div className="col-span-5 grid grid-cols-2 gap-3">
          <div className="bg-surface-container-low rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant">Seller revenue</div>
            <div className="text-2xl font-black mt-1 text-primary">{money(stats?.revenue)}</div>
            <div className="text-xs text-on-surface-variant mt-1">From your order items</div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant">Orders</div>
            <div className="text-2xl font-black mt-1">{stats?.orders_count ?? 0}</div>
            <div className="text-xs text-on-surface-variant mt-1">Real seller orders</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Sales</div>
          <div className="text-3xl font-black mt-1">{money(stats?.revenue)}</div>
          <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>database</span>Live from orders
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Units sold</div>
          <div className="text-3xl font-black mt-1">{stats?.units_sold ?? 0}</div>
          <div className="text-xs text-on-surface-variant mt-1">Across seller items</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Active listings</div>
          <div className="text-3xl font-black mt-1">{stats?.active_products ?? stats?.products_count ?? 0}</div>
          <div className="text-xs text-amber-700 mt-1">{stats?.low_stock_products ?? 0} low stock</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Pending orders</div>
          <div className="text-3xl font-black mt-1">{stats?.pending_orders ?? 0}</div>
          <div className="text-xs text-on-surface-variant mt-1">Need attention</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-outline-variant">
            <h2 className="h-display text-lg">Orders to fulfill</h2>
            <button onClick={() => navigate('/seller/orders')} className="text-sm font-bold text-primary">All orders →</button>
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
              {recentOrders.map((order) => (
                <tr key={order.id} className={order.status === 'pending' ? 'bg-red-50/40' : undefined}>
                  <td className="px-5 py-3">
                    <div className="font-mono font-bold text-primary">#{order.reference ?? `SK-${String(order.id).padStart(5, '0')}`}</div>
                    <div className="text-xs text-on-surface-variant mt-1">{dateTime(order.created_at)}</div>
                  </td>
                  <td>{order.customer?.name ?? 'Client'}</td>
                  <td>{order.items?.[0]?.product_name ?? 'Mixed order'}</td>
                  <td className="text-right font-bold">{order.items_count}</td>
                  <td className="text-right font-black">{money(order.seller_total)}</td>
                  <td className="px-5"><span className={`chip ${STATUS_CHIP[order.status] ?? 'bg-surface-container-high'}`}>{STATUS_LABEL[order.status] ?? order.status}</span></td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-on-surface-variant">No seller orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Latest seller item</h2>
          <div className="aspect-square ph-walnut rounded-xl mb-4 relative">
            <span className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Live data</span>
          </div>
          <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Recent order item</div>
          <div className="font-bold mt-1">{firstItem?.product_name ?? 'No orders yet'}</div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            <div className="bg-surface-container-low rounded-lg p-2">
              <div className="text-on-surface-variant uppercase tracking-widest-2">Qty</div>
              <div className="font-black text-base">{firstItem?.quantity ?? 0}</div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-2">
              <div className="text-on-surface-variant uppercase tracking-widest-2">Total</div>
              <div className="font-black text-base">{money(firstItem?.total)}</div>
            </div>
          </div>
          <button onClick={() => navigate('/seller/orders')} className="mt-5 w-full btn-grad text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-widest-2">Open commandes</button>
        </div>
      </div>
    </>
  )
}
