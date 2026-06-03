import { useState } from 'react'
import { useAdminSellers, useApproveSeller } from '../hooks/useAdmin'
import { useUiStore } from '../store/uiStore'

const phColors = ['ph-walnut', 'ph-charcoal', 'ph-warm', 'ph-wood', 'ph-cream', 'ph-mesh', 'ph-dark']

export default function AdminSellers() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminSellers({ search: search || undefined })
  const approveSeller = useApproveSeller()
  const { showToast } = useUiStore()
  const sellers: any[] = data?.data ?? []
  const meta = (data as any)?.meta ?? data
  const total = meta?.total ?? sellers.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const topSellers = [...sellers]
    .sort((a, b) => (b.products_count ?? 0) - (a.products_count ?? 0))
    .slice(0, 3)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="h-display text-3xl">Sellers &amp; Ateliers</h1><p className="text-sm text-on-surface-variant">{total} seller{total !== 1 ? 's' : ''} found</p></div>
        <button onClick={() => showToast('Atelier invitation coming soon', 'info')} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>Invite atelier</button>
      </div>

      {/* Top sellers */}
      {topSellers.length > 0 && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          {topSellers.map((seller: any, i: number) => (
            <div key={seller.id} className={`bg-white rounded-xl p-6 shadow-soft ${i === 0 ? 'relative overflow-hidden' : ''}`}>
              {i === 0 && <div className="absolute top-4 right-4 chip btn-grad text-white uppercase tracking-widest-2">#1 Seller</div>}
              <div className={`w-14 h-14 rounded-xl ${phColors[i % phColors.length]}`}></div>
              <h3 className="font-bold mt-4">{seller.name}</h3>
              <div className="text-xs text-on-surface-variant">{seller.email}</div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div><div className="text-on-surface-variant uppercase tracking-widest-2">Products</div><div className="font-black text-base">{seller.products_count ?? 0}</div></div>
                <div><div className="text-on-surface-variant uppercase tracking-widest-2">Role</div><div className="font-black text-base capitalize">{seller.role}</div></div>
                <div><div className="text-on-surface-variant uppercase tracking-widest-2">Joined</div><div className="font-black text-base">{seller.created_at ? new Date(seller.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '—'}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All sellers */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 py-5 border-b border-outline-variant flex items-center gap-3">
          <h3 className="h-display text-lg flex-1">All partners</h3>
          <div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="pl-10 h-9 rounded-lg bg-surface-container-low border border-outline-variant text-sm w-64" placeholder="Search atelier..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low"><th className="text-left px-6 py-3">Atelier</th><th className="text-left py-3">Email</th><th className="text-left py-3">Joined</th><th className="text-right py-3">Products</th><th className="text-left py-3">Status</th><th className="text-left py-3 px-6">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {sellers.map((seller: any, i: number) => (
              <tr key={seller.id}>
                <td className="px-6 py-3"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-lg ${phColors[i % phColors.length]}`}></div><div><div className="font-bold">{seller.name}</div><div className="text-xs text-on-surface-variant">{seller.phone ?? ''}</div></div></div></td>
                <td className="text-xs">{seller.email}</td>
                <td>{seller.created_at ? new Date(seller.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}</td>
                <td className="text-right font-bold">{seller.products_count ?? 0}</td>
                <td><span className="chip bg-emerald-100 text-emerald-700">Active</span></td>
                <td className="px-6">
                  <button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button>
                </td>
              </tr>
            ))}
            {sellers.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">No sellers found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
