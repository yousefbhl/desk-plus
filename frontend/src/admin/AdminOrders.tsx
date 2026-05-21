import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useAdmin'
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
  const { data, isLoading } = useAdminOrders()
  const orders = data?.data ?? []
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
          <p className="text-sm text-on-surface-variant">87 orders today · 14 awaiting your action</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>print</span>Print picking list</button>
          <button className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>Manual order</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft border-l-4 border-primary"><div className="text-xs uppercase tracking-widest-2 font-bold text-primary">New</div><div className="text-3xl font-black mt-1">14</div><div className="text-xs text-on-surface-variant">to confirm</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Preparing</div><div className="text-3xl font-black mt-1">22</div><div className="text-xs text-on-surface-variant">in workshop</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Shipped</div><div className="text-3xl font-black mt-1">31</div><div className="text-xs text-on-surface-variant">in transit</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Delivered</div><div className="text-3xl font-black mt-1">218</div><div className="text-xs text-on-surface-variant">this month</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Refunded</div><div className="text-3xl font-black mt-1">3</div><div className="text-xs text-emerald-700">1.4% rate</div></div>
      </div>

      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-5 flex items-center gap-3 border-b border-outline-variant">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search by order # or customer..." /></div>
          <button className="chip border border-outline-variant bg-white">Status: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="chip border border-outline-variant bg-white">Date: Last 30 days <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="chip border border-outline-variant bg-white">Payment: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
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
          <div className="text-on-surface-variant">Showing 1–7 of 87 orders</div>
          <div className="flex gap-2">
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_left</span></button>
            <button className="w-8 h-8 rounded-lg btn-grad text-white font-bold">1</button>
            <button className="w-8 h-8 hover:bg-surface-container-low rounded-lg font-semibold">2</button>
            <button className="w-8 h-8 hover:bg-surface-container-low rounded-lg font-semibold">3</button>
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  )
}
