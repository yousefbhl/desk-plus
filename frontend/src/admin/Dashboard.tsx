import { Link } from 'react-router-dom'
import { useAdminStats } from '../hooks/useAdmin'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { data: stats, isLoading } = useAdminStats()
  const user = useAuthStore((s) => s.user)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Hero greeting */}
      <div className="bg-[#1c1b1b] text-white rounded-xl p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-7">
            <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">Tuesday · March 14</p>
            <h1 className="h-display text-4xl">Good morning, {user?.name?.split(' ')[0] ?? 'Admin'}.</h1>
            <p className="text-white/60 mt-2">14 new orders, 4 atelier applications, and revenue is up 24% on the week.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/admin/orders" className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>priority_high</span>Review 14 orders</Link>
              <Link to="/admin/sellers" className="border border-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/10">View applications</Link>
            </div>
          </div>
          <div className="col-span-5 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/5 rounded-xl p-4"><div className="text-[10px] uppercase tracking-widest-2 text-white/50">Today's revenue</div><div className="text-2xl font-black mt-1">42,180</div><div className="text-[10px] text-emerald-400 font-bold">&uarr; 12%</div></div>
            <div className="bg-white/5 rounded-xl p-4"><div className="text-[10px] uppercase tracking-widest-2 text-white/50">Orders</div><div className="text-2xl font-black mt-1">28</div><div className="text-[10px] text-emerald-400 font-bold">&uarr; 4</div></div>
            <div className="bg-white/5 rounded-xl p-4"><div className="text-[10px] uppercase tracking-widest-2 text-white/50">Visitors</div><div className="text-2xl font-black mt-1">1,842</div><div className="text-[10px] text-emerald-400 font-bold">&uarr; 18%</div></div>
          </div>
        </div>
        <svg className="absolute -right-10 -bottom-10 w-72 h-72 opacity-10" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="#ba0a0d" strokeWidth=".5" />
          <circle cx="50" cy="50" r="34" stroke="#ba0a0d" strokeWidth=".5" />
          <circle cx="50" cy="50" r="20" stroke="#ba0a0d" strokeWidth=".5" />
        </svg>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl btn-grad text-white grid place-items-center"><span className="material-symbols-outlined">payments</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">+24%</span>
          </div>
          <div className="text-3xl font-black mt-4">847K <span className="text-base">MAD</span></div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Revenue · 30d</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">receipt_long</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">+18%</span>
          </div>
          <div className="text-3xl font-black mt-4">312</div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Orders · 30d</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">group_add</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">+128</span>
          </div>
          <div className="text-3xl font-black mt-4">3,247</div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Customers</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high grid place-items-center"><span className="material-symbols-outlined">trending_up</span></div>
            <span className="chip bg-emerald-100 text-emerald-700">+5.2%</span>
          </div>
          <div className="text-3xl font-black mt-4">2,716</div>
          <div className="text-xs uppercase tracking-widest-2 text-on-surface-variant mt-1">Avg. order · MAD</div>
        </div>
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Sales chart */}
        <div className="col-span-8 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div><h2 className="h-display text-lg">Revenue · last 14 days</h2><div className="text-xs text-on-surface-variant">Compared to previous fortnight</div></div>
            <div className="flex gap-2">
              <button className="chip btn-grad uppercase tracking-widest-2">Revenue</button>
              <button className="chip bg-surface-container-high">Orders</button>
              <button className="chip bg-surface-container-high">Visitors</button>
            </div>
          </div>
          <svg viewBox="0 0 800 240" className="w-full">
            <defs>
              <linearGradient id="fillRev" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ba0a0d" stopOpacity=".25" />
                <stop offset="100%" stopColor="#ba0a0d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="#e5e2e1" strokeDasharray="2 4">
              <line x1="0" y1="40" x2="800" y2="40" /><line x1="0" y1="100" x2="800" y2="100" /><line x1="0" y1="160" x2="800" y2="160" /><line x1="0" y1="220" x2="800" y2="220" />
            </g>
            <g fill="#9c9c9c" fontSize="10" fontFamily="Inter">
              <text x="4" y="44">50K</text><text x="4" y="104">35K</text><text x="4" y="164">20K</text><text x="4" y="224">5K</text>
            </g>
            {/* Prior period */}
            <polyline fill="none" stroke="#d6d2d0" strokeWidth="2" strokeDasharray="4 4"
              points="60,170 110,160 160,150 210,155 260,140 310,135 360,125 410,130 460,120 510,110 560,115 610,100 660,95 710,90" />
            {/* Current */}
            <path d="M60,150 L110,140 L160,120 L210,130 L260,110 L310,100 L360,80 L410,90 L460,70 L510,60 L560,75 L610,55 L660,40 L710,30 L710,240 L60,240 Z" fill="url(#fillRev)" />
            <polyline fill="none" stroke="#ba0a0d" strokeWidth="2.5"
              points="60,150 110,140 160,120 210,130 260,110 310,100 360,80 410,90 460,70 510,60 560,75 610,55 660,40 710,30" />
            <g fill="#ba0a0d">
              <circle cx="710" cy="30" r="5" />
            </g>
            {/* Tooltip on latest point */}
            <g transform="translate(660,-10)">
              <rect x="0" y="20" width="120" height="38" rx="6" fill="#1c1b1b" />
              <text x="10" y="36" fill="#fff" fontSize="10" fontFamily="Inter" fontWeight="700">Mar 14 · TUE</text>
              <text x="10" y="50" fill="#fff" fontSize="11" fontFamily="Inter" fontWeight="800">42,180 MAD</text>
            </g>
          </svg>
          <div className="flex justify-between text-xs text-on-surface-variant mt-1 px-12"><span>Mar 1</span><span>Mar 5</span><span>Mar 9</span><span>Mar 14</span></div>
        </div>

        {/* Activity feed */}
        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="h-display text-lg">Live activity</h2>
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 pulse-ring"></span>Live</span>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center text-[10px] font-black flex-shrink-0">RM</div>
              <div className="flex-1">
                <div><strong>Rachid M.</strong> placed order <a className="font-mono text-primary font-bold">#DK-00248</a></div>
                <div className="text-xs text-on-surface-variant">18,420 MAD · 5 items · 2 min ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 grid place-items-center flex-shrink-0"><span className="material-symbols-outlined" style={{fontSize:18}}>storefront</span></div>
              <div className="flex-1">
                <div><strong>Argan Office Co.</strong> applied to join as atelier</div>
                <div className="text-xs text-on-surface-variant">Agadir · 14 min ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center flex-shrink-0"><span className="material-symbols-outlined" style={{fontSize:18}}>check_circle</span></div>
              <div className="flex-1">
                <div><strong>Order #DK-00245</strong> marked as delivered</div>
                <div className="text-xs text-on-surface-variant">Aicha T. · 32 min ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 grid place-items-center flex-shrink-0"><span className="material-symbols-outlined" style={{fontSize:18}}>star</span></div>
              <div className="flex-1">
                <div>New 5-star review on <strong>ErgoFlex Pro</strong></div>
                <div className="text-xs text-on-surface-variant">"...uncanny lumbar suspension..." · 1h ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 text-primary grid place-items-center flex-shrink-0"><span className="material-symbols-outlined" style={{fontSize:18}}>inventory_2</span></div>
              <div className="flex-1">
                <div><strong>Brass Pivot Stool</strong> sold out</div>
                <div className="text-xs text-on-surface-variant">SKU DK-BPS-BR02 · 2h ago</div>
              </div>
            </div>
          </div>
          <a className="block mt-5 pt-4 border-t border-outline-variant text-center text-sm font-bold text-primary">View all activity &rarr;</a>
        </div>
      </div>

      {/* 3-col bottom row */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Today's tasks */}
        <div className="col-span-5 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Today's action list</h2>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-red-50">
              <span className="ck on"><span className="material-symbols-outlined" style={{fontSize:14}}>priority_high</span></span>
              <div className="flex-1"><div className="font-bold">Review 14 incoming orders</div><div className="text-xs text-on-surface-variant">Confirm payment + dispatch to atelier</div></div>
              <span className="chip bg-primary text-white">Urgent</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant">
              <span className="ck"></span>
              <div className="flex-1"><div className="font-semibold">Approve 4 atelier applications</div><div className="text-xs text-on-surface-variant">Avg response time: 1.4d</div></div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant">
              <span className="ck"></span>
              <div className="flex-1"><div className="font-semibold">Reorder ErgoFlex Pro Mesh</div><div className="text-xs text-on-surface-variant">3 left · 5-day lead time</div></div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant">
              <span className="ck"></span>
              <div className="flex-1"><div className="font-semibold">Reply to refund request #DK-00244</div><div className="text-xs text-on-surface-variant">Mehdi Bensaid · 5h ago</div></div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant opacity-50">
              <span className="ck on"><span className="material-symbols-outlined" style={{fontSize:14}}>check</span></span>
              <div className="flex-1"><div className="font-semibold line-through">Publish Spring catalog email</div><div className="text-xs text-emerald-700">Sent to 4,200 subscribers · 09:42</div></div>
            </label>
          </div>
        </div>

        {/* Top sellers */}
        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Top ateliers this month</h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-walnut relative"><span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-white rounded-full text-[10px] font-black grid place-items-center">1</span></div>
              <div className="flex-1"><div className="font-bold">Atelier Bensaid</div><div className="text-xs text-on-surface-variant">42 SKUs · 4.9 &#9733;</div></div>
              <div className="font-black">312K</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-charcoal relative"><span className="absolute -top-1 -left-1 w-5 h-5 bg-on-surface text-white rounded-full text-[10px] font-black grid place-items-center">2</span></div>
              <div className="flex-1"><div className="font-bold">Kendo Studio</div><div className="text-xs text-on-surface-variant">28 SKUs · 4.7 &#9733;</div></div>
              <div className="font-black">218K</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-warm relative"><span className="absolute -top-1 -left-1 w-5 h-5 bg-on-surface-variant text-white rounded-full text-[10px] font-black grid place-items-center">3</span></div>
              <div className="flex-1"><div className="font-bold">Maison Lalla</div><div className="text-xs text-on-surface-variant">18 SKUs · 4.8 &#9733;</div></div>
              <div className="font-black">142K</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg ph-wood"></div>
              <div className="flex-1"><div className="font-bold">Bois Economie</div><div className="text-xs text-on-surface-variant">14 SKUs · 4.5 &#9733;</div></div>
              <div className="font-black">86K</div>
            </div>
          </div>
          <Link to="/admin/sellers" className="block mt-5 pt-4 border-t border-outline-variant text-center text-sm font-bold text-primary">All sellers &rarr;</Link>
        </div>

        {/* Inventory alerts */}
        <div className="col-span-3 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Inventory alerts</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-lg bg-red-50 border-l-4 border-primary">
              <div className="text-[10px] font-bold uppercase tracking-widest-2 text-primary">Out of stock</div>
              <div className="font-bold mt-0.5">Brass Pivot Stool</div>
              <div className="text-xs text-on-surface-variant">Hidden from store</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-500">
              <div className="text-[10px] font-bold uppercase tracking-widest-2 text-amber-700">Low stock</div>
              <div className="font-bold mt-0.5">ErgoFlex Pro Mesh</div>
              <div className="text-xs text-on-surface-variant">3 units left</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border-l-4 border-amber-500">
              <div className="text-[10px] font-bold uppercase tracking-widest-2 text-amber-700">Low stock</div>
              <div className="font-bold mt-0.5">Lumi Task Light</div>
              <div className="text-xs text-on-surface-variant">7 units left</div>
            </div>
          </div>
          <Link to="/admin/products" className="block mt-4 text-center text-sm font-bold text-primary">View 12 alerts &rarr;</Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 className="h-display text-lg">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-bold text-primary">All orders &rarr;</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant bg-surface-container-low">
            <tr><th className="text-left px-6 py-3">Order</th><th className="text-left py-3">Customer</th><th className="text-left py-3">Items</th><th className="text-right py-3">Total</th><th className="text-left py-3">Status</th><th className="px-6"></th></tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr><td className="px-6 py-3 font-mono font-bold text-primary">#DK-00248</td><td className="font-semibold">Rachid Moubarak</td><td>5 items</td><td className="text-right font-black">18,420 MAD</td><td><span className="chip bg-red-100 text-primary">&#9679; New</span></td><td className="px-6"><a className="text-primary font-bold text-xs">Review &rarr;</a></td></tr>
            <tr><td className="px-6 py-3 font-mono font-bold text-primary">#DK-00247</td><td className="font-semibold">Sofia Filali</td><td>2 items</td><td className="text-right font-black">4,780 MAD</td><td><span className="chip bg-blue-100 text-blue-700">Preparing</span></td><td className="px-6"><a className="text-primary font-bold text-xs">View &rarr;</a></td></tr>
            <tr><td className="px-6 py-3 font-mono font-bold text-primary">#DK-00246</td><td className="font-semibold">Younes Khalil</td><td>1 item</td><td className="text-right font-black">2,890 MAD</td><td><span className="chip bg-purple-100 text-purple-700">Shipped</span></td><td className="px-6"><a className="text-primary font-bold text-xs">View &rarr;</a></td></tr>
            <tr><td className="px-6 py-3 font-mono font-bold text-primary">#DK-00245</td><td className="font-semibold">Aicha Talbi</td><td>4 items</td><td className="text-right font-black">14,147 MAD</td><td><span className="chip bg-emerald-100 text-emerald-700">Delivered</span></td><td className="px-6"><a className="text-primary font-bold text-xs">View &rarr;</a></td></tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
