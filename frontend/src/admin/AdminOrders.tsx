import { useState } from 'react'
import { useAdminOrders, useAdminStats, useUpdateOrderStatus } from '../hooks/useAdmin'
import { useUiStore } from '../store/uiStore'

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-red-100 text-primary',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-emerald-100 text-emerald-700',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminOrders({ search: search || undefined, status: statusFilter || undefined, page, per_page: 20 })
  const { data: stats } = useAdminStats()
  const orders: any[] = data?.data ?? []
  const meta = (data as any)?.meta ?? data
  const total = meta?.total ?? orders.length
  const lastPage = meta?.last_page ?? 1
  const currentPage = meta?.current_page ?? page
  const ordersByStatus: Record<string, number> = (stats as any)?.orders_by_status ?? {}
  const updateStatus = useUpdateOrderStatus()
  const { showToast } = useUiStore()

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
        <div>
          <h1 className="h-display text-3xl">Orders</h1>
          <p className="text-sm text-on-surface-variant">{total} order{total !== 1 ? 's' : ''} · {ordersByStatus.pending ?? 0} pending</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>print</span>Print picking list</button>
          <button onClick={() => showToast('Manual order creation coming soon', 'info')} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>Manual order</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft border-l-4 border-primary"><div className="text-xs uppercase tracking-widest-2 font-bold text-primary">Pending</div><div className="text-3xl font-black mt-1">{ordersByStatus.pending ?? 0}</div><div className="text-xs text-on-surface-variant">to confirm</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Processing</div><div className="text-3xl font-black mt-1">{(ordersByStatus.processing ?? 0) + (ordersByStatus.preparing ?? 0)}</div><div className="text-xs text-on-surface-variant">in workshop</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Shipped</div><div className="text-3xl font-black mt-1">{(ordersByStatus.shipped ?? 0) + (ordersByStatus.shipping ?? 0)}</div><div className="text-xs text-on-surface-variant">in transit</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Delivered</div><div className="text-3xl font-black mt-1">{ordersByStatus.delivered ?? 0}</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Cancelled</div><div className="text-3xl font-black mt-1">{ordersByStatus.cancelled ?? 0}</div></div>
      </div>

      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-5 flex items-center gap-3 border-b border-outline-variant">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search by order # or customer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} /></div>
          <select className="chip border border-outline-variant bg-white cursor-pointer" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">Status: All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low border-b border-outline-variant"><th className="text-left px-6 py-3">Order</th><th className="text-left py-3">Customer</th><th className="text-left py-3">Items</th><th className="text-left py-3">Payment</th><th className="text-left py-3">Status</th><th className="text-right py-3">Total</th><th className="text-left py-3 px-6">Placed</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {orders.map((order) => (
              <tr key={order.id} className={order.status === 'pending' ? 'bg-red-50/40' : ''}>
                <td className="px-6 py-3 font-mono font-bold text-primary">#{order.reference ?? `DK-${String(order.id).padStart(5, '0')}`}</td>
                <td><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-surface-container-high grid place-items-center text-xs font-black">{initials(order.user?.name ?? 'U')}</div><div><div className="font-semibold">{order.user?.name ?? 'Customer'}</div><div className="text-xs text-on-surface-variant">{order.user?.email}</div></div></div></td>
                <td>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</td>
                <td><span className="chip bg-emerald-100 text-emerald-700">{order.payment_status ?? 'Paid'}</span></td>
                <td><select className={`chip ${STATUS_STYLES[order.status] ?? 'bg-gray-200 text-gray-700'} cursor-pointer`} value={order.status} onChange={(e) => { updateStatus.mutate({ id: order.id, status: e.target.value }, { onSuccess: () => showToast('Status updated'), onError: () => showToast('Failed to update status', 'error') }) }}><option value="pending">pending</option><option value="processing">processing</option><option value="shipped">shipped</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option></select></td>
                <td className="text-right font-black">{order.total.toLocaleString()} MAD</td>
                <td className="px-6 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-on-surface-variant">No orders yet</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant text-sm">
          <div className="text-on-surface-variant">Showing page {currentPage} of {lastPage} ({total} total)</div>
          <div className="flex gap-2">
            <button disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low disabled:opacity-30"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_left</span></button>
            {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 grid place-items-center rounded-lg font-semibold ${p === currentPage ? 'btn-grad text-white font-bold' : 'hover:bg-surface-container-low'}`}>{p}</button>
            ))}
            {lastPage > 5 && <span className="text-on-surface-variant">...</span>}
            {lastPage > 5 && <button onClick={() => setPage(lastPage)} className={`w-8 h-8 grid place-items-center rounded-lg font-semibold ${lastPage === currentPage ? 'btn-grad text-white font-bold' : 'hover:bg-surface-container-low'}`}>{lastPage}</button>}
            <button disabled={currentPage >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low disabled:opacity-30"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  )
}
