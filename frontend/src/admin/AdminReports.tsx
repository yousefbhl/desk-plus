import { useAdminStats } from '../hooks/useAdmin'

export default function AdminReports() {
  const { data: stats, isLoading } = useAdminStats()

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
        <div><h1 className="h-display text-3xl">Reports</h1><p className="text-sm text-on-surface-variant">Performance · Last 30 days vs prior period</p></div>
        <div className="flex gap-2">
          <button className="chip border border-outline-variant bg-white">Period: Last 30 days <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>file_download</span>Export PDF</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Revenue</div>
          <div className="text-3xl font-black mt-1">847K <span className="text-base font-bold">MAD</span></div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{fontSize:14}}>trending_up</span>+24.3% vs prior</div>
          <svg viewBox="0 0 200 40" className="w-full mt-3 h-8"><polyline fill="none" stroke="#ba0a0d" strokeWidth="2" points="0,30 20,28 40,24 60,26 80,18 100,20 120,12 140,16 160,8 180,10 200,4" /></svg>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Orders</div>
          <div className="text-3xl font-black mt-1">312</div>
          <div className="text-xs text-emerald-700 mt-1">+18.1% vs prior</div>
          <svg viewBox="0 0 200 40" className="w-full mt-3 h-8"><polyline fill="none" stroke="#5c403c" strokeWidth="2" points="0,28 20,30 40,22 60,24 80,20 100,16 120,18 140,14 160,12 180,10 200,8" /></svg>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Avg. order value</div>
          <div className="text-3xl font-black mt-1">2,716 <span className="text-base font-bold">MAD</span></div>
          <div className="text-xs text-emerald-700 mt-1">+5.2% vs prior</div>
          <svg viewBox="0 0 200 40" className="w-full mt-3 h-8"><polyline fill="none" stroke="#5c403c" strokeWidth="2" points="0,20 20,22 40,18 60,24 80,18 100,22 120,16 140,18 160,14 180,16 200,12" /></svg>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Returns</div>
          <div className="text-3xl font-black mt-1">1.4%</div>
          <div className="text-xs text-emerald-700 mt-1">&darr; 0.6pp vs prior</div>
          <svg viewBox="0 0 200 40" className="w-full mt-3 h-8"><polyline fill="none" stroke="#5c403c" strokeWidth="2" points="0,12 20,16 40,14 60,18 80,16 100,20 120,22 140,20 160,24 180,26 200,28" /></svg>
        </div>
      </div>

      {/* Main chart */}
      <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="h-display text-xl">Revenue by day</h2><p className="text-xs text-on-surface-variant">Compared to previous 30-day period</p></div>
          <div className="flex gap-2 text-xs"><span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-sm"></span>This period</span><span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-surface-container-high rounded-sm"></span>Prior period</span></div>
        </div>
        <svg viewBox="0 0 1200 280" className="w-full">
          <g stroke="#e5e2e1" strokeDasharray="2 4"><line x1="0" y1="40" x2="1200" y2="40" /><line x1="0" y1="100" x2="1200" y2="100" /><line x1="0" y1="160" x2="1200" y2="160" /><line x1="0" y1="220" x2="1200" y2="220" /></g>
          <g fill="#9c9c9c" fontSize="10" fontFamily="Inter"><text x="4" y="44">40K</text><text x="4" y="104">30K</text><text x="4" y="164">20K</text><text x="4" y="224">10K</text></g>
          {/* Prior bars */}
          <g fill="#d6d2d0">
            <rect x="50" y="180" width="22" height="80" /><rect x="90" y="160" width="22" height="100" /><rect x="130" y="190" width="22" height="70" /><rect x="170" y="170" width="22" height="90" /><rect x="210" y="150" width="22" height="110" /><rect x="250" y="180" width="22" height="80" /><rect x="290" y="170" width="22" height="90" /><rect x="330" y="160" width="22" height="100" /><rect x="370" y="180" width="22" height="80" /><rect x="410" y="150" width="22" height="110" /><rect x="450" y="160" width="22" height="100" /><rect x="490" y="150" width="22" height="110" /><rect x="530" y="140" width="22" height="120" /><rect x="570" y="130" width="22" height="130" /><rect x="610" y="150" width="22" height="110" /><rect x="650" y="140" width="22" height="120" /><rect x="690" y="120" width="22" height="140" /><rect x="730" y="130" width="22" height="130" /><rect x="770" y="110" width="22" height="150" /><rect x="810" y="130" width="22" height="130" /><rect x="850" y="120" width="22" height="140" /><rect x="890" y="100" width="22" height="160" /><rect x="930" y="120" width="22" height="140" /><rect x="970" y="100" width="22" height="160" /><rect x="1010" y="110" width="22" height="150" /><rect x="1050" y="90" width="22" height="170" /><rect x="1090" y="100" width="22" height="160" /><rect x="1130" y="80" width="22" height="180" />
          </g>
          {/* This period */}
          <g fill="#ba0a0d">
            <rect x="74" y="160" width="14" height="100" /><rect x="114" y="140" width="14" height="120" /><rect x="154" y="170" width="14" height="90" /><rect x="194" y="150" width="14" height="110" /><rect x="234" y="120" width="14" height="140" /><rect x="274" y="140" width="14" height="120" /><rect x="314" y="150" width="14" height="110" /><rect x="354" y="130" width="14" height="130" /><rect x="394" y="140" width="14" height="120" /><rect x="434" y="120" width="14" height="140" /><rect x="474" y="130" width="14" height="130" /><rect x="514" y="110" width="14" height="150" /><rect x="554" y="100" width="14" height="160" /><rect x="594" y="90" width="14" height="170" /><rect x="634" y="120" width="14" height="140" /><rect x="674" y="100" width="14" height="160" /><rect x="714" y="80" width="14" height="180" /><rect x="754" y="90" width="14" height="170" /><rect x="794" y="70" width="14" height="190" /><rect x="834" y="90" width="14" height="170" /><rect x="874" y="80" width="14" height="180" /><rect x="914" y="60" width="14" height="200" /><rect x="954" y="80" width="14" height="180" /><rect x="994" y="50" width="14" height="210" /><rect x="1034" y="70" width="14" height="190" /><rect x="1074" y="40" width="14" height="220" /><rect x="1114" y="60" width="14" height="200" /><rect x="1154" y="30" width="14" height="230" />
          </g>
        </svg>
        <div className="flex justify-between text-xs text-on-surface-variant mt-2 px-12"><span>Feb 12</span><span>Feb 19</span><span>Feb 26</span><span>Mar 4</span><span>Mar 11</span></div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-xl p-6 shadow-soft col-span-2">
          <h3 className="h-display text-lg mb-4">Top products</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg ph-walnut"></div><div className="flex-1"><div className="font-semibold text-sm">Aileron Executive Oak</div><div className="text-xs text-on-surface-variant">42 sold · Desks</div></div><div className="flex-1 max-w-[200px] h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{width:'100%'}}></div></div><div className="font-black text-sm w-24 text-right">205,800 MAD</div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg ph-mesh-chair"></div><div className="flex-1"><div className="font-semibold text-sm">ErgoFlex Pro Mesh</div><div className="text-xs text-on-surface-variant">38 sold · Chairs</div></div><div className="flex-1 max-w-[200px] h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{width:'78%'}}></div></div><div className="font-black text-sm w-24 text-right">132,620 MAD</div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg ph-cream"></div><div className="flex-1"><div className="font-semibold text-sm">Linen Task Plus</div><div className="text-xs text-on-surface-variant">52 sold · Chairs</div></div><div className="flex-1 max-w-[200px] h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{width:'54%'}}></div></div><div className="font-black text-sm w-24 text-right">98,280 MAD</div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg ph-dark"></div><div className="flex-1"><div className="font-semibold text-sm">Lumi Task Light</div><div className="text-xs text-on-surface-variant">61 sold · Lighting</div></div><div className="flex-1 max-w-[200px] h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{width:'38%'}}></div></div><div className="font-black text-sm w-24 text-right">78,690 MAD</div></div>
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg ph-wood"></div><div className="flex-1"><div className="font-semibold text-sm">Cube Modular Shelf</div><div className="text-xs text-on-surface-variant">24 sold · Storage</div></div><div className="flex-1 max-w-[200px] h-2 bg-surface-container-low rounded-full overflow-hidden"><div className="h-full btn-grad" style={{width:'29%'}}></div></div><div className="font-black text-sm w-24 text-right">59,760 MAD</div></div>
          </div>
        </div>
        {/* Donut */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h3 className="h-display text-lg mb-4">Revenue by style</h3>
          <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#ba0a0d" strokeWidth="6" strokeDasharray="32 88" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#5c403c" strokeWidth="6" strokeDasharray="24 96" strokeDashoffset="-32" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#7c4a3a" strokeWidth="6" strokeDasharray="20 100" strokeDashoffset="-56" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1c1b1b" strokeWidth="6" strokeDasharray="14 106" strokeDashoffset="-76" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#d6d2d0" strokeWidth="6" strokeDasharray="10 110" strokeDashoffset="-90" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="text-xs text-on-surface-variant">Total</div><div className="text-2xl font-black">847K</div></div>
          </div>
          <div className="mt-5 space-y-2 text-xs">
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary"></span>Kendo</span><strong>32%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#5c403c]"></span>Woody</span><strong>24%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#7c4a3a]"></span>Atelier</span><strong>20%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#1c1b1b]"></span>Hacker</span><strong>14%</strong></div>
            <div className="flex justify-between"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-[#d6d2d0]"></span>Coco/Other</span><strong>10%</strong></div>
          </div>
        </div>
      </div>
    </>
  )
}
