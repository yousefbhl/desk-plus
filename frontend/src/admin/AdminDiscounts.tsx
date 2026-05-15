import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api'
import { TableRowSkeleton } from '../components/ui/Skeleton'
import { useToastStore } from '../store/toastStore'

const EMPTY = { code: '', type: 'percentage' as 'percentage' | 'fixed', value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true }

export default function AdminDiscounts() {
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm]       = useState(EMPTY)
  const qc = useQueryClient()
  const { show } = useToastStore()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: () => adminApi.discounts().then((r) => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      editing ? adminApi.updateDiscount(editing.id, payload) : adminApi.createDiscount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-discounts'] })
      show(editing ? 'Discount updated' : 'Discount created', 'success')
      close()
    },
    onError: (e: any) => show(e?.response?.data?.message ?? 'Error', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteDiscount(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-discounts'] }); show('Deleted', 'success') },
  })

  const open  = (d?: any) => { setEditing(d ?? null); setForm(d ? { ...d, value: String(d.value), min_order_amount: String(d.min_order_amount ?? ''), max_uses: String(d.max_uses ?? ''), expires_at: d.expires_at?.slice(0,10) ?? '' } : EMPTY); setModal(true) }
  const close = () => { setModal(false); setEditing(null) }
  const setF  = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    saveMutation.mutate({ ...form, value: +form.value, min_order_amount: form.min_order_amount ? +form.min_order_amount : null, max_uses: form.max_uses ? +form.max_uses : null })
  }

  const discounts = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Manage</p>
          <h1 className="h-display text-4xl">DISCOUNTS</h1>
        </div>
        <button onClick={() => open()} className="btn-grad px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          New Discount
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant border-b border-outline-variant/60">
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-right px-4 py-3">Value</th>
              <th className="text-right px-4 py-3">Min Order</th>
              <th className="text-right px-4 py-3">Uses</th>
              <th className="text-left px-4 py-3">Expires</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
            ) : discounts.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-16 text-on-surface-variant">No discounts yet</td></tr>
            ) : discounts.map((d: any) => (
              <tr key={d.id} className="border-b border-outline-variant/40 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3 font-mono font-black text-primary">{d.code}</td>
                <td className="px-4 py-3 capitalize text-on-surface-variant">{d.type}</td>
                <td className="px-4 py-3 text-right font-bold">{d.type === 'percentage' ? `${d.value}%` : `${d.value} MAD`}</td>
                <td className="px-4 py-3 text-right text-on-surface-variant">{d.min_order_amount ? `${d.min_order_amount} MAD` : '—'}</td>
                <td className="px-4 py-3 text-right text-on-surface-variant">{d.usage_count ?? 0}{d.max_uses ? `/${d.max_uses}` : ''}</td>
                <td className="px-4 py-3 text-on-surface-variant">{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3">
                  <span className={`chip text-xs ${d.is_active ? 'bg-green-50 text-green-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {d.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => open(d)} className="w-8 h-8 rounded-lg hover:bg-surface-container-high grid place-items-center text-on-surface-variant">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                    </button>
                    <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(d.id) }} className="w-8 h-8 rounded-lg hover:bg-red-50 grid place-items-center text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <>
          <div className="fixed inset-0 bg-on-surface/30 z-40 flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-ambient-lg w-full max-w-md p-8 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-black text-lg">{editing ? 'Edit Discount' : 'New Discount'}</h2>
                <button onClick={close} className="w-8 h-8 grid place-items-center rounded-full hover:bg-surface-container-high">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Code</label>
                  <input className="field !font-mono !uppercase" placeholder="SUMMER30" value={form.code} onChange={setF('code')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Type</label>
                    <select className="field cursor-pointer" value={form.type} onChange={setF('type')}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Value</label>
                    <input type="number" className="field" placeholder={form.type === 'percentage' ? '20' : '500'} value={form.value} onChange={setF('value')} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Min Order (MAD)</label>
                    <input type="number" className="field" value={form.min_order_amount} onChange={setF('min_order_amount')} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Max Uses</label>
                    <input type="number" className="field" value={form.max_uses} onChange={setF('max_uses')} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Expires At</label>
                  <input type="date" className="field" value={form.expires_at} onChange={setF('expires_at')} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={close} className="flex-1 py-3 rounded-xl font-bold border-2 border-outline-variant hover:bg-surface-container-high transition-colors text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1 btn-grad py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  {saveMutation.isPending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
