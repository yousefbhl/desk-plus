import { useAdminSellers, useApproveSeller } from '../hooks/useAdmin'
import { useUiStore } from '../store/uiStore'

export default function AdminSellers() {
  const { data, isLoading } = useAdminSellers()
  const approveSeller = useApproveSeller()
  const { showToast } = useUiStore()
  const sellers = data?.data ?? []

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
        <div><h1 className="h-display text-3xl">Sellers &amp; Ateliers</h1><p className="text-sm text-on-surface-variant">28 active partners · 4 pending approval</p></div>
        <button className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>Invite atelier</button>
      </div>

      {/* Pending approvals */}
      <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-xl p-5 mb-6 flex items-center gap-4">
        <span className="material-symbols-outlined ms-fill text-amber-700">priority_high</span>
        <div className="flex-1"><div className="font-bold text-amber-900">4 atelier applications waiting for your review</div><div className="text-xs text-amber-800">Avg response time: 1.4 days · You're ahead of the curve.</div></div>
        <button className="btn-grad text-white font-bold px-4 py-2 rounded-lg text-sm" onClick={() => { const pending = sellers.filter((s: any) => s.role === 'pending' || s.status === 'pending'); if (pending.length > 0) { approveSeller.mutate({ id: pending[0].id, role: 'seller' }, { onSuccess: () => showToast('Seller approved'), onError: () => showToast('Failed to approve', 'error') }) } }}>Review applications &rarr;</button>
      </div>

      {/* Top sellers */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-soft relative overflow-hidden">
          <div className="absolute top-4 right-4 chip btn-grad text-white uppercase tracking-widest-2">#1 Atelier</div>
          <div className="w-14 h-14 rounded-xl ph-walnut"></div>
          <h3 className="font-bold mt-4">Atelier Bensaid</h3>
          <div className="text-xs text-on-surface-variant">Walnut &amp; oak · Casablanca</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">Sales</div><div className="font-black text-base">312K</div></div>
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">Rating</div><div className="font-black text-base">4.9 &#9733;</div></div>
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">SKUs</div><div className="font-black text-base">42</div></div>
          </div>
          <div className="mt-3 text-xs flex justify-between text-on-surface-variant"><span>Commission</span><strong className="text-on-surface">15%</strong></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <div className="w-14 h-14 rounded-xl ph-charcoal"></div>
          <h3 className="font-bold mt-4">Kendo Studio</h3>
          <div className="text-xs text-on-surface-variant">Industrial steel · Rabat</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">Sales</div><div className="font-black text-base">218K</div></div>
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">Rating</div><div className="font-black text-base">4.7 &#9733;</div></div>
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">SKUs</div><div className="font-black text-base">28</div></div>
          </div>
          <div className="mt-3 text-xs flex justify-between text-on-surface-variant"><span>Commission</span><strong className="text-on-surface">18%</strong></div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <div className="w-14 h-14 rounded-xl ph-warm"></div>
          <h3 className="font-bold mt-4">Maison Lalla</h3>
          <div className="text-xs text-on-surface-variant">Brass &amp; marble · Marrakech</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">Sales</div><div className="font-black text-base">142K</div></div>
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">Rating</div><div className="font-black text-base">4.8 &#9733;</div></div>
            <div><div className="text-on-surface-variant uppercase tracking-widest-2">SKUs</div><div className="font-black text-base">18</div></div>
          </div>
          <div className="mt-3 text-xs flex justify-between text-on-surface-variant"><span>Commission</span><strong className="text-on-surface">20%</strong></div>
        </div>
      </div>

      {/* All sellers */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 py-5 border-b border-outline-variant flex items-center gap-3">
          <h3 className="h-display text-lg flex-1">All partners</h3>
          <div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="pl-10 h-9 rounded-lg bg-surface-container-low border border-outline-variant text-sm w-64" placeholder="Search atelier..." /></div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low"><th className="text-left px-6 py-3">Atelier</th><th className="text-left py-3">Location</th><th className="text-left py-3">Onboarded</th><th className="text-right py-3">SKUs</th><th className="text-right py-3">Sales (90d)</th><th className="text-right py-3">Commission</th><th className="text-left py-3">Rating</th><th className="text-left py-3 px-6">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-walnut"></div><div><div className="font-bold">Atelier Bensaid</div><div className="text-xs text-on-surface-variant">Yassine Bensaid</div></div></div></td><td>Casablanca</td><td>Feb 2022</td><td className="text-right font-bold">42</td><td className="text-right font-black">312,400 MAD</td><td className="text-right">15%</td><td>4.9 &#9733; <span className="text-xs text-on-surface-variant">(218)</span></td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-charcoal"></div><div><div className="font-bold">Kendo Studio</div><div className="text-xs text-on-surface-variant">Karim Tazi</div></div></div></td><td>Rabat</td><td>Mar 2022</td><td className="text-right font-bold">28</td><td className="text-right font-black">218,300 MAD</td><td className="text-right">18%</td><td>4.7 &#9733; <span className="text-xs text-on-surface-variant">(142)</span></td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-warm"></div><div><div className="font-bold">Maison Lalla</div><div className="text-xs text-on-surface-variant">Lalla Ouafa</div></div></div></td><td>Marrakech</td><td>Sep 2023</td><td className="text-right font-bold">18</td><td className="text-right font-black">142,800 MAD</td><td className="text-right">20%</td><td>4.8 &#9733; <span className="text-xs text-on-surface-variant">(86)</span></td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-wood"></div><div><div className="font-bold">Bois Economie</div><div className="text-xs text-on-surface-variant">Hassan Errachidi</div></div></div></td><td>Fes</td><td>Jan 2024</td><td className="text-right font-bold">14</td><td className="text-right font-black">86,200 MAD</td><td className="text-right">15%</td><td>4.5 &#9733; <span className="text-xs text-on-surface-variant">(34)</span></td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-cream"></div><div><div className="font-bold">Coco Souk</div><div className="text-xs text-on-surface-variant">Najwa El-Idrissi</div></div></div></td><td>Tangier</td><td>Nov 2024</td><td className="text-right font-bold">9</td><td className="text-right font-black">42,600 MAD</td><td className="text-right">20%</td><td>4.6 &#9733; <span className="text-xs text-on-surface-variant">(18)</span></td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Active</span></td></tr>
            <tr className="bg-amber-50/40"><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-mesh"></div><div><div className="font-bold">Argan Office Co.</div><div className="text-xs text-on-surface-variant">Hicham Ait-Mansour</div></div></div></td><td>Agadir</td><td className="text-amber-700 font-semibold">Applied 2d ago</td><td className="text-right">&mdash;</td><td className="text-right">&mdash;</td><td className="text-right">&mdash;</td><td>&mdash;</td><td className="px-6"><span className="chip bg-amber-100 text-amber-700">Pending review</span></td></tr>
            <tr><td className="px-6 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg ph-dark opacity-60"></div><div><div className="font-bold">Forge Atlas</div><div className="text-xs text-on-surface-variant">Driss Akhrif</div></div></div></td><td>Meknes</td><td>Aug 2023</td><td className="text-right font-bold">6</td><td className="text-right text-on-surface-variant">12,400 MAD</td><td className="text-right">18%</td><td>3.8 &#9733; <span className="text-xs text-on-surface-variant">(12)</span></td><td className="px-6"><span className="chip bg-gray-200 text-gray-700">Paused</span></td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
