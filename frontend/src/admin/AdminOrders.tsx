import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api'
import { TableRowSkeleton } from '../components/ui/Skeleton'
import { useToastStore } from '../store/toastStore'

const STATUSES = ['all', 'pending', 'preparing', 'shipped', 'delivered', 'cancelled']
const STATUS_CLASS: Record<string, string> = {
  pending: 'badge-pending', preparing: 'badge-preparing',
  shipped: 'badge-shipped', delivered: 'badge-delivered', cancelled: 'badge-cancelled',
}

export default function AdminOrders() {
  const [tab,      setTab]    = useState('all')
  const [selected, setSelected] = useState<any | null>(null)
  const qc = useQueryClient()
  const { show } = useToastStore()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', tab],
    queryFn: () => adminApi.orders(tab === 'all' ? {} : { status: tab }).then((r) => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
      show('Order status updated', 'success')
    },
  })

  const orders = data?.data ?? []

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Manage</p>
        <h1 className="h-display text-4xl">ORDERS</h1>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 mb-6 w-fit scrollx">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${tab === s ? 'bg-surface-container-lowest shadow-ambient text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Table */}
        <div className="flex-1 min-w-0 bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant border-b border-outline-variant/60">
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-on-surface-variant">No orders found</td></tr>
              ) : orders.map((o: any) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className={`border-b border-outline-variant/40 hover:bg-surface-container-low cursor-pointer transition-colors ${selected?.id === o.id ? 'bg-primary/5' : ''}`}
                >
                  <td className="px-4 py-3 font-mono font-bold text-primary">#DK-{String(o.id).padStart(5,'0')}</td>
                  <td className="px-4 py-3 font-medium">{o.user?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right font-bold">{o.total.toLocaleString()} MAD</td>
                  <td className="px-4 py-3">
                    <span className={`chip capitalize ${STATUS_CLASS[o.status] ?? 'badge-pending'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_right</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 shrink-0 bg-surface-container-lowest rounded-xl shadow-ambient p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono font-black text-primary">#DK-{String(selected.id).padStart(5,'0')}</p>
              <button onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-1">Customer</p>
            <p className="font-medium mb-4">{selected.user?.name ?? '—'}</p>

            <p className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-2">Update Status</p>
            <div className="space-y-2 mb-5">
              {STATUSES.filter((s) => s !== 'all').map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus.mutate({ id: selected.id, status: s })}
                  disabled={selected.status === s || updateStatus.isPending}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${selected.status === s ? 'bg-primary/10 text-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
                >
                  {s}
                  {selected.status === s && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-2">Items</p>
            <div className="space-y-2">
              {(selected.items ?? []).map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-on-surface-variant truncate flex-1">{item.product_name} ×{item.quantity}</span>
                  <span className="font-bold ml-2">{item.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant mt-3 pt-3 flex justify-between font-bold text-sm">
              <span>Total</span>
              <span className="text-primary">{selected.total.toLocaleString()} MAD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
