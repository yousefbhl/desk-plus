import { useAdminDiscounts } from '../hooks/useAdmin'

export default function AdminDiscounts() {
  const { data, isLoading } = useAdminDiscounts()

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
        <div><h1 className="h-display text-3xl">Discounts &amp; Promotions</h1><p className="text-sm text-on-surface-variant">8 active codes · 3 scheduled · 4 automatic rules</p></div>
        <button className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>Create promotion</button>
      </div>

      {/* Featured banner builder */}
      <div className="bg-white rounded-xl p-6 shadow-soft mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-primary">Currently running</div>
          <h2 className="h-display text-2xl mt-1">Ramadan Atelier · 20% off Kendo</h2>
          <p className="text-sm text-on-surface-variant mt-2">Auto-applied at checkout · Min basket 2,000 MAD · Ends in <strong className="text-on-surface">3d 14h</strong></p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-surface-container-low rounded-lg p-3"><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Uses</div><div className="text-xl font-black">142</div></div>
            <div className="bg-surface-container-low rounded-lg p-3"><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Revenue</div><div className="text-xl font-black">87K</div></div>
            <div className="bg-surface-container-low rounded-lg p-3"><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Avg. saving</div><div className="text-xl font-black">580</div></div>
          </div>

          <div className="mt-5 flex gap-2"><button className="btn-grad text-white font-bold px-4 py-2 rounded-lg text-sm">Edit</button><button className="border border-outline-variant font-semibold px-4 py-2 rounded-lg text-sm">Duplicate</button><button className="border border-outline-variant text-primary font-semibold px-4 py-2 rounded-lg text-sm">Pause</button></div>
        </div>
        <div className="col-span-7 bg-[#1c1b1b] rounded-xl p-8 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-widest-2 text-white/50 mb-2">Customer-facing preview</div>
          <div className="font-black text-white text-4xl leading-tight">RAMADAN<br /><span className="italic font-light text-primary">atelier</span></div>
          <div className="text-white/70 italic mt-2">&mdash; 20% off the Kendo collection.</div>
          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg btn-grad text-white text-xs font-bold uppercase tracking-widest-2">Shop now &rarr;</div>
          <svg className="absolute -bottom-10 -right-10 w-44 h-44 opacity-20" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#ba0a0d" strokeWidth="0.5" /><circle cx="50" cy="50" r="36" stroke="#ba0a0d" strokeWidth="0.5" /><circle cx="50" cy="50" r="22" stroke="#ba0a0d" strokeWidth="0.5" /></svg>
        </div>
      </div>

      {/* Promo list */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 py-5 border-b border-outline-variant flex items-center gap-3">
          <h3 className="h-display text-lg flex-1">All promotions</h3>
          <button className="chip border border-outline-variant bg-white">Type: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="chip border border-outline-variant bg-white">Status: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low"><th className="text-left px-6 py-3">Name / Code</th><th className="text-left py-3">Type</th><th className="text-left py-3">Conditions</th><th className="text-right py-3">Uses</th><th className="text-right py-3">Revenue</th><th className="text-left py-3">Schedule</th><th className="text-left py-3 px-6">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr><td className="px-6 py-3"><div className="font-bold">Ramadan Atelier</div><div className="text-xs font-mono text-primary">Auto-apply</div></td><td>20% off collection</td><td className="text-xs text-on-surface-variant">Kendo only · Min 2,000 MAD</td><td className="text-right font-bold">142</td><td className="text-right font-black">87,420 MAD</td><td className="text-xs">Mar 1 – Mar 22</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">&#9679; Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="font-bold">Welcome 100</div><div className="text-xs font-mono text-primary">WELCOME100</div></td><td>100 MAD off</td><td className="text-xs text-on-surface-variant">1st order · No minimum</td><td className="text-right font-bold">218</td><td className="text-right font-black">412,330 MAD</td><td className="text-xs">Evergreen</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">&#9679; Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="font-bold">Free Casa Delivery</div><div className="text-xs font-mono text-primary">CASA-FREE</div></td><td>Free shipping</td><td className="text-xs text-on-surface-variant">Casablanca only · Min 1,500 MAD</td><td className="text-right font-bold">87</td><td className="text-right font-black">142,800 MAD</td><td className="text-xs">Evergreen</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">&#9679; Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="font-bold">Premium Tier — Always 10</div><div className="text-xs font-mono text-primary">Auto-apply</div></td><td>10% off all</td><td className="text-xs text-on-surface-variant">Premium members</td><td className="text-right font-bold">312</td><td className="text-right font-black">218,400 MAD</td><td className="text-xs">Evergreen</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">&#9679; Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="font-bold">Bundle: Desk + Chair</div><div className="text-xs font-mono text-primary">BUNDLE15</div></td><td>15% off bundle</td><td className="text-xs text-on-surface-variant">Desk + Chair together</td><td className="text-right font-bold">28</td><td className="text-right font-black">64,820 MAD</td><td className="text-xs">Feb 14 – Mar 14</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">&#9679; Active</span></td></tr>
            <tr><td className="px-6 py-3"><div className="font-bold">Spring Mood — Coco</div><div className="text-xs font-mono text-primary">SPRING25</div></td><td>25% off</td><td className="text-xs text-on-surface-variant">Coco style</td><td className="text-right">&mdash;</td><td className="text-right">&mdash;</td><td className="text-xs">Apr 1 – Apr 30</td><td className="px-6"><span className="chip bg-blue-100 text-blue-700">Scheduled</span></td></tr>
            <tr><td className="px-6 py-3"><div className="font-bold">Winter Sale 2024</div><div className="text-xs font-mono text-on-surface-variant">WINTER24</div></td><td>30% off</td><td className="text-xs text-on-surface-variant">Storewide · Expired</td><td className="text-right font-bold">412</td><td className="text-right font-black">682,150 MAD</td><td className="text-xs">Dec 1 – Jan 7</td><td className="px-6"><span className="chip bg-gray-200 text-gray-700">Ended</span></td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
