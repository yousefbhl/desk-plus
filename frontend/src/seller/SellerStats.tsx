import { useSellerStats } from '../hooks/useSeller'

export default function SellerStats() {
  const { data: stats, isLoading } = useSellerStats()

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
        <div><h1 className="h-display text-3xl">Statistics</h1><p className="text-sm text-on-surface-variant">Your atelier{"'"}s pulse — last 90 days</p></div>
        <div className="flex gap-2">
          <button className="chip border border-outline-variant bg-white">Last 90 days <span className="material-symbols-outlined" style={{ fontSize: 14 }}>expand_more</span></button>
          <button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>file_download</span>Export</button>
        </div>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Net revenue</div>
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
          <div className="text-3xl font-black mt-3">312,400 <span className="text-base">MAD</span></div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>+34% vs prior 90d</div>
          <svg viewBox="0 0 200 30" className="w-full mt-2"><polyline fill="none" stroke="#ba0a0d" strokeWidth="2" points="0,22 20,20 40,16 60,18 80,14 100,12 120,8 140,10 160,5 180,7 200,2" /></svg>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Conversion</div>
            <span className="material-symbols-outlined text-on-surface-variant">conversion_path</span>
          </div>
          <div className="text-3xl font-black mt-3">4.8%</div>
          <div className="text-xs text-emerald-700 mt-1">↑ 0.6 pp</div>
          <svg viewBox="0 0 200 30" className="w-full mt-2"><polyline fill="none" stroke="#5c403c" strokeWidth="2" points="0,18 20,20 40,15 60,17 80,14 100,12 120,15 140,10 160,8 180,11 200,6" /></svg>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Avg. order value</div>
            <span className="material-symbols-outlined text-on-surface-variant">shopping_bag</span>
          </div>
          <div className="text-3xl font-black mt-3">3,632 <span className="text-base">MAD</span></div>
          <div className="text-xs text-emerald-700 mt-1">↑ 12%</div>
          <svg viewBox="0 0 200 30" className="w-full mt-2"><polyline fill="none" stroke="#5c403c" strokeWidth="2" points="0,20 20,18 40,15 60,17 80,12 100,14 120,10 140,12 160,8 180,10 200,5" /></svg>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant">Return rate</div>
            <span className="material-symbols-outlined text-on-surface-variant">restart_alt</span>
          </div>
          <div className="text-3xl font-black mt-3">0.8%</div>
          <div className="text-xs text-emerald-700 mt-1">↓ 0.4 pp</div>
          <svg viewBox="0 0 200 30" className="w-full mt-2"><polyline fill="none" stroke="#5c403c" strokeWidth="2" points="0,10 20,12 40,11 60,14 80,15 100,18 120,17 140,20 160,22 180,24 200,25" /></svg>
        </div>
      </div>

      {/* Big chart */}
      <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="h-display text-lg">Revenue vs platform average</h2><div className="text-xs text-on-surface-variant">How Atelier Bensaïd performs against the 28-atelier average</div></div>
          <div className="flex gap-2"><button className="chip btn-grad uppercase tracking-widest-2">Weekly</button><button className="chip bg-surface-container-high">Daily</button></div>
        </div>
        <svg viewBox="0 0 900 280" className="w-full">
          <defs>
            <linearGradient id="fillSelf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ba0a0d" stopOpacity={0.25} /><stop offset="1" stopColor="#ba0a0d" stopOpacity={0} /></linearGradient>
          </defs>
          <g stroke="#e5e2e1" strokeDasharray="2 4">
            <line x1="0" y1="40" x2="900" y2="40" /><line x1="0" y1="100" x2="900" y2="100" /><line x1="0" y1="160" x2="900" y2="160" /><line x1="0" y1="220" x2="900" y2="220" />
          </g>
          <g fill="#9c9c9c" fontSize={10} fontFamily="Inter">
            <text x="6" y="44">40K</text><text x="6" y="104">30K</text><text x="6" y="164">20K</text><text x="6" y="224">10K</text>
          </g>
          {/* Platform avg */}
          <polyline fill="none" stroke="#d6d2d0" strokeWidth="2" strokeDasharray="6 4"
            points="60,160 130,150 200,150 270,140 340,135 410,130 480,125 550,120 620,115 690,110 760,105 830,100" />
          {/* Self */}
          <path d="M60,140 L130,130 L200,110 L270,120 L340,90 L410,85 L480,60 L550,70 L620,50 L690,40 L760,30 L830,20 L830,260 L60,260 Z" fill="url(#fillSelf)" />
          <polyline fill="none" stroke="#ba0a0d" strokeWidth="2.5"
            points="60,140 130,130 200,110 270,120 340,90 410,85 480,60 550,70 620,50 690,40 760,30 830,20" />
          <g fill="#ba0a0d">
            <circle cx="830" cy="20" r="5" />
          </g>
          {/* Labels */}
          <g fontFamily="Inter" fontSize={10} fontWeight={700}>
            <text x="844" y="24" fill="#ba0a0d">You · 31K</text>
            <text x="844" y="106" fill="#9c9c9c">Avg · 22K</text>
          </g>
        </svg>
        <div className="flex justify-between text-xs text-on-surface-variant mt-1 px-14"><span>W1</span><span>W3</span><span>W5</span><span>W7</span><span>W9</span><span>W11</span></div>
      </div>

      {/* 3 columns: products / customers / acquisition */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Top products */}
        <div className="col-span-5 bg-white rounded-xl p-6 shadow-soft">
          <h3 className="h-display text-lg mb-4">Your top pieces</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-walnut relative"><span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white rounded-full text-[10px] font-black grid place-items-center">1</span></div>
              <div className="flex-1"><div className="font-bold text-sm">Aileron Executive Oak</div><div className="text-xs text-on-surface-variant">42 sold</div><div className="mt-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '100%' }}></div></div></div>
              <div className="font-black text-sm">205,800</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-wood relative"><span className="absolute -top-1 -left-1 w-5 h-5 bg-on-surface text-white rounded-full text-[10px] font-black grid place-items-center">2</span></div>
              <div className="flex-1"><div className="font-bold text-sm">Atelier Sit-Stand</div><div className="text-xs text-on-surface-variant">14 sold</div><div className="mt-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '55%' }}></div></div></div>
              <div className="font-black text-sm">114,800</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-walnut relative"><span className="absolute -top-1 -left-1 w-5 h-5 bg-on-surface-variant text-white rounded-full text-[10px] font-black grid place-items-center">3</span></div>
              <div className="flex-1"><div className="font-bold text-sm">Bensaïd Credenza Mk II</div><div className="text-xs text-on-surface-variant">14 sold</div><div className="mt-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '45%' }}></div></div></div>
              <div className="font-black text-sm">95,200</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-wood"></div>
              <div className="flex-1"><div className="font-bold text-sm">Cube Modular Shelf</div><div className="text-xs text-on-surface-variant">24 sold</div><div className="mt-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '29%' }}></div></div></div>
              <div className="font-black text-sm">59,760</div>
            </div>
          </div>
        </div>

        {/* Customer segments donut */}
        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <h3 className="h-display text-lg mb-4">Customer mix</h3>
          <div className="relative w-44 h-44 mx-auto">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ba0a0d" strokeWidth="6" strokeDasharray="38 88" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#5c403c" strokeWidth="6" strokeDasharray="28 88" strokeDashoffset="-38" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#b67a64" strokeWidth="6" strokeDasharray="14 88" strokeDashoffset="-66" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#d6d2d0" strokeWidth="6" strokeDasharray="8 88" strokeDashoffset="-80" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-[10px] text-on-surface-variant uppercase tracking-widest-2">Buyers</div><div className="text-xl font-black">86</div></div></div>
          </div>
          <div className="mt-5 space-y-2 text-xs">
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary"></span>Premium customers</span><strong>42%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#5c403c]"></span>Repeat customers</span><strong>32%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#b67a64]"></span>First-time</span><strong>16%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#d6d2d0]"></span>B2B / wholesale</span><strong>10%</strong></div>
          </div>
        </div>

        {/* Reviews */}
        <div className="col-span-3 bg-white rounded-xl p-6 shadow-soft">
          <h3 className="h-display text-lg mb-2">Review pulse</h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-5xl font-black text-primary">4.9</span>
            <span className="text-on-surface-variant text-sm">/ 5</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2"><span className="w-4">5★</span><div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '86%' }}></div></div><span className="w-7 text-right">187</span></div>
            <div className="flex items-center gap-2"><span className="w-4">4★</span><div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '11%' }}></div></div><span className="w-7 text-right">24</span></div>
            <div className="flex items-center gap-2"><span className="w-4">3★</span><div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '2%' }}></div></div><span className="w-7 text-right">4</span></div>
            <div className="flex items-center gap-2"><span className="w-4">2★</span><div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '1%' }}></div></div><span className="w-7 text-right">2</span></div>
            <div className="flex items-center gap-2"><span className="w-4">1★</span><div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{ width: '0%' }}></div></div><span className="w-7 text-right">1</span></div>
          </div>
          <div className="mt-4 pt-4 border-t border-outline-variant text-xs text-on-surface-variant">218 reviews · 32 unanswered</div>
          <button className="mt-2 w-full btn-grad text-white font-bold py-2 rounded-lg text-xs uppercase tracking-widest-2">Reply to 32 →</button>
        </div>
      </div>

      {/* Payouts */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <h2 className="h-display text-lg">Payouts</h2>
            <div className="text-xs text-on-surface-variant">Earnings after 15% Desk+ commission</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant">Pending</div>
            <div className="text-3xl font-black text-primary">42,810 MAD</div>
            <div className="text-xs text-on-surface-variant">Releases Mar 21 to BMCE-9 ••2841</div>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant bg-surface-container-low">
            <tr><th className="text-left px-6 py-3">Date</th><th className="text-left py-3">Reference</th><th className="text-right py-3">Gross</th><th className="text-right py-3">Commission</th><th className="text-right py-3">Net</th><th className="text-left py-3 px-6">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr><td className="px-6 py-3 font-semibold">Mar 14</td><td className="font-mono text-on-surface-variant">PO-2025-11</td><td className="text-right">50,365 MAD</td><td className="text-right text-on-surface-variant">−7,555 MAD</td><td className="text-right font-black">42,810 MAD</td><td className="px-6"><span className="chip bg-amber-100 text-amber-700">Processing</span></td></tr>
            <tr><td className="px-6 py-3 font-semibold">Mar 7</td><td className="font-mono text-on-surface-variant">PO-2025-10</td><td className="text-right">38,200 MAD</td><td className="text-right text-on-surface-variant">−5,730 MAD</td><td className="text-right font-black">32,470 MAD</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Paid</span></td></tr>
            <tr><td className="px-6 py-3 font-semibold">Feb 28</td><td className="font-mono text-on-surface-variant">PO-2025-09</td><td className="text-right">42,800 MAD</td><td className="text-right text-on-surface-variant">−6,420 MAD</td><td className="text-right font-black">36,380 MAD</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Paid</span></td></tr>
            <tr><td className="px-6 py-3 font-semibold">Feb 21</td><td className="font-mono text-on-surface-variant">PO-2025-08</td><td className="text-right">28,400 MAD</td><td className="text-right text-on-surface-variant">−4,260 MAD</td><td className="text-right font-black">24,140 MAD</td><td className="px-6"><span className="chip bg-emerald-100 text-emerald-700">Paid</span></td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
