import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sellerApi } from '../api'

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n || 0))

const STATUS_CHIP: Record<string, string> = {
  pending:   'bg-red-100 text-primary',
  preparing: 'bg-blue-100 text-blue-700',
  shipping:  'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

const TABS = [
  { key: '',          label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'shipping',  label: 'Shipping' },
  { key: 'delivered', label: 'Delivered' },
]

export default function SellerOrders() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['seller-orders', status, search],
    queryFn: () => sellerApi.orders({ status, search }),
  })

  const rows = data?.data ?? []

  return (
    <div>
      <div className="mb-6">
        <h1 className="h-display text-3xl">Commandes</h1>
        <p className="text-sm text-on-surface-variant">Orders containing your pieces</p>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient mb-6">
        <div className="flex items-center gap-1 px-5 pt-4 border-b border-outline-variant overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${status === t.key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          <div className="relative max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
            <input className="field !pl-9 !h-10" placeholder="Search by order reference…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
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
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-surface-container-high rounded animate-pulse" /></td></tr>
              ))
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-on-surface-variant">No orders found</td></tr>
            ) : rows.map((o: any, i: number) => (
              <tr key={i} className="hover:bg-surface-container-low transition-colors">
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
    </div>
  )
}