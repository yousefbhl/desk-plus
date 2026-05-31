import { useState } from 'react'
import { useAdminDiscounts, useDeleteDiscount, useCreateDiscount } from '../hooks/useAdmin'
import { useUiStore } from '../store/uiStore'

export default function AdminDiscounts() {
  const { data, isLoading } = useAdminDiscounts()
  const deleteDiscount = useDeleteDiscount()
  const createDiscount = useCreateDiscount()
  const { showToast } = useUiStore()
  const discounts: any[] = data?.data ?? []
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage')
  const [newValue, setNewValue] = useState('')
  const [newMaxUses, setNewMaxUses] = useState('')
  const [newMinAmount, setNewMinAmount] = useState('')
  const [newExpiry, setNewExpiry] = useState('')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  
  const activeDiscount = discounts.find((d: any) => d.is_active)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="h-display text-3xl">Discounts &amp; Promotions</h1><p className="text-sm text-on-surface-variant">{discounts.length} discount{discounts.length !== 1 ? 's' : ''}</p></div>
        <button onClick={() => setShowCreateModal(true)} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>Create promotion</button>
      </div>

      {/* Featured banner */}
      {activeDiscount && (
        <div className="bg-white rounded-xl p-6 shadow-soft mb-6 grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="text-xs uppercase tracking-widest-2 font-bold text-primary">Currently running</div>
            <h2 className="h-display text-2xl mt-1">{activeDiscount.code} · {activeDiscount.type === 'percentage' ? `${activeDiscount.value}% off` : `${activeDiscount.value} MAD off`}</h2>
            <p className="text-sm text-on-surface-variant mt-2">
              {activeDiscount.min_amount ? `Min basket ${activeDiscount.min_amount.toLocaleString()} MAD` : 'No minimum'}
              {activeDiscount.expires_at ? ` · Ends ${new Date(activeDiscount.expires_at).toLocaleDateString()}` : ' · No expiry'}
            </p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-surface-container-low rounded-lg p-3"><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Uses</div><div className="text-xl font-black">{activeDiscount.used_count ?? 0}</div></div>
              <div className="bg-surface-container-low rounded-lg p-3"><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Max uses</div><div className="text-xl font-black">{activeDiscount.max_uses ?? '∞'}</div></div>
              <div className="bg-surface-container-low rounded-lg p-3"><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Value</div><div className="text-xl font-black">{activeDiscount.value}{activeDiscount.type === 'percentage' ? '%' : ' MAD'}</div></div>
            </div>
          </div>
          <div className="col-span-7 bg-[#1c1b1b] rounded-xl p-8 relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest-2 text-white/50 mb-2">Discount code</div>
            <div className="font-black text-white text-4xl leading-tight">{activeDiscount.code}</div>
            <div className="text-white/70 italic mt-2">&mdash; {activeDiscount.type === 'percentage' ? `${activeDiscount.value}% off` : `${activeDiscount.value} MAD off`}</div>
            <svg className="absolute -bottom-10 -right-10 w-44 h-44 opacity-20" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#ba0a0d" strokeWidth="0.5" /><circle cx="50" cy="50" r="36" stroke="#ba0a0d" strokeWidth="0.5" /><circle cx="50" cy="50" r="22" stroke="#ba0a0d" strokeWidth="0.5" /></svg>
          </div>
        </div>
      )}

      {/* Promo list */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 py-5 border-b border-outline-variant flex items-center gap-3">
          <h3 className="h-display text-lg flex-1">All promotions</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low"><th className="text-left px-6 py-3">Code</th><th className="text-left py-3">Type</th><th className="text-left py-3">Value</th><th className="text-right py-3">Uses</th><th className="text-right py-3">Max uses</th><th className="text-left py-3">Expires</th><th className="text-left py-3">Status</th><th className="text-left py-3 px-6">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {discounts.map((d: any) => (
              <tr key={d.id}>
                <td className="px-6 py-3"><div className="font-bold">{d.code}</div></td>
                <td className="capitalize">{d.type ?? '—'}</td>
                <td className="font-bold">{d.value}{d.type === 'percentage' ? '%' : ' MAD'}</td>
                <td className="text-right font-bold">{d.used_count ?? 0}</td>
                <td className="text-right">{d.max_uses ?? '∞'}</td>
                <td className="text-xs">{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : 'Never'}</td>
                <td className="px-2">
                  {d.is_active
                    ? <span className="chip bg-emerald-100 text-emerald-700">&#9679; Active</span>
                    : <span className="chip bg-gray-200 text-gray-700">Inactive</span>
                  }
                </td>
                <td className="px-6">
                  <button
                    onClick={() => {
                      if (confirm('Delete this discount?')) {
                        deleteDiscount.mutate(d.id, {
                          onSuccess: () => showToast('Discount deleted'),
                          onError: () => showToast('Failed to delete', 'error'),
                        })
                      }
                    }}
                    className="text-primary text-xs font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-on-surface-variant">No discounts found. Create your first promotion!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create promotion modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl p-6 shadow-soft w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="h-display text-lg mb-4">Create Promotion</h2>
            <div className="space-y-3">
              <div><label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Code</label><input className="field w-full mt-1" placeholder="e.g. DESK20" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Type</label><select className="field w-full mt-1" value={newType} onChange={(e) => setNewType(e.target.value as any)}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></div>
                <div><label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Value</label><input className="field w-full mt-1" type="number" placeholder={newType === 'percentage' ? '20' : '100'} value={newValue} onChange={(e) => setNewValue(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Max uses</label><input className="field w-full mt-1" type="number" placeholder="Unlimited" value={newMaxUses} onChange={(e) => setNewMaxUses(e.target.value)} /></div>
                <div><label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Min amount (MAD)</label><input className="field w-full mt-1" type="number" placeholder="0" value={newMinAmount} onChange={(e) => setNewMinAmount(e.target.value)} /></div>
              </div>
              <div><label className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Expiry date</label><input className="field w-full mt-1" type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowCreateModal(false)} className="border border-outline-variant font-semibold px-4 py-2.5 rounded-xl text-sm">Cancel</button>
              <button
                onClick={() => {
                  if (!newCode || !newValue) { showToast('Code and value are required', 'error'); return }
                  createDiscount.mutate({
                    code: newCode,
                    type: newType,
                    value: Number(newValue),
                    max_uses: newMaxUses ? Number(newMaxUses) : null,
                    min_amount: newMinAmount ? Number(newMinAmount) : null,
                    expires_at: newExpiry || null,
                    is_active: true,
                  } as any, {
                    onSuccess: () => { showToast('Promotion created!'); setShowCreateModal(false); setNewCode(''); setNewValue(''); setNewMaxUses(''); setNewMinAmount(''); setNewExpiry('') },
                    onError: () => showToast('Failed to create promotion', 'error'),
                  })
                }}
                className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2"
              >
                {createDiscount.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
