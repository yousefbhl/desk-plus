import { Link, useNavigate } from 'react-router-dom'
import { useSellerStats } from '../hooks/useSeller'
import { useAuthStore } from '../store/authStore'
import { useUiStore } from '../store/uiStore'

export default function SellerDashboard() {
  const { data: stats, isLoading } = useSellerStats()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { showToast } = useUiStore()

  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-white border-2 border-outline-variant rounded-xl p-8 mb-6 grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">{dayName} · {monthDay}</p>
          <h1 className="h-display text-4xl">Salam, {user?.name?.split(' ')[0] ?? 'Seller'}.</h1>
          <p className="text-on-surface-variant mt-2">Your atelier sold <strong className="text-primary">12 pieces yesterday</strong>. Two products are running low — let{"'"}s restock before the weekend.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/seller/products" className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2">Manage products</Link>
            <button onClick={() => showToast('Seller orders view coming soon', 'info')} className="border border-outline-variant font-semibold px-5 py-2.5 rounded-xl text-sm">View orders</button>
          </div>
        </div>
        <div className="col-span-5 grid grid-cols-2 gap-3">
          <div className="bg-surface-container-low rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant">Pending payout</div>
            <div className="text-2xl font-black mt-1 text-primary">42,810 <span className="text-sm">MAD</span></div>
            <div className="text-xs text-on-surface-variant mt-1">Releases Mar 21</div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest-2 text-on-surface-variant">Atelier rank</div>
            <div className="text-2xl font-black mt-1">#1<span className="text-sm text-emerald-700"> ↑2</span></div>
            <div className="text-xs text-on-surface-variant mt-1">of 28 partners</div>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Sales · 30d</div>
          <div className="text-3xl font-black mt-1">312,400 <span className="text-base">MAD</span></div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>+34% vs prior</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Units sold</div>
          <div className="text-3xl font-black mt-1">86</div>
          <div className="text-xs text-emerald-700 mt-1">+12 vs prior</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Active listings</div>
          <div className="text-3xl font-black mt-1">42</div>
          <div className="text-xs text-amber-700 mt-1">2 low stock</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-soft">
          <div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Avg. rating</div>
          <div className="text-3xl font-black mt-1">4.9 <span className="text-primary">★</span></div>
          <div className="text-xs text-on-surface-variant mt-1">218 reviews</div>
        </div>
      </div>

      {/* Sales chart + Top product */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-8 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div><h2 className="h-display text-lg">Sales · last 30 days</h2><div className="text-xs text-on-surface-variant">Daily revenue from your atelier</div></div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-sm"></span>Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#5c403c] rounded-sm"></span>Units</span>
            </div>
          </div>
          <svg viewBox="0 0 800 220" className="w-full">
            <defs>
              <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ba0a0d" stopOpacity={0.3} /><stop offset="1" stopColor="#ba0a0d" stopOpacity={0} /></linearGradient>
            </defs>
            <g stroke="#e5e2e1" strokeDasharray="2 4"><line x1="0" y1="40" x2="800" y2="40" /><line x1="0" y1="100" x2="800" y2="100" /><line x1="0" y1="160" x2="800" y2="160" /></g>
            <path d="M40,170 L80,160 L120,140 L160,130 L200,150 L240,120 L280,100 L320,110 L360,85 L400,90 L440,70 L480,60 L520,75 L560,55 L600,40 L640,50 L680,30 L720,20 L720,210 L40,210 Z" fill="url(#sg)" />
            <polyline fill="none" stroke="#ba0a0d" strokeWidth="2.5" points="40,170 80,160 120,140 160,130 200,150 240,120 280,100 320,110 360,85 400,90 440,70 480,60 520,75 560,55 600,40 640,50 680,30 720,20" />
            <polyline fill="none" stroke="#5c403c" strokeWidth="2" strokeDasharray="3 3" points="40,180 80,170 120,165 160,160 200,170 240,155 280,140 320,150 360,130 400,135 440,120 480,115 520,125 560,110 600,100 640,105 680,95 720,90" />
            <circle cx="720" cy="20" r="5" fill="#ba0a0d" />
          </svg>
          <div className="flex justify-between text-xs text-on-surface-variant px-12 mt-1"><span>Feb 12</span><span>Feb 22</span><span>Mar 4</span><span>Mar 14</span></div>
        </div>

        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <h2 className="h-display text-lg mb-4">Hero piece</h2>
          <div className="aspect-square ph-walnut rounded-xl mb-4 relative">
            <span className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Top seller</span>
          </div>
          <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Desk · Walnut</div>
          <div className="font-bold mt-1">Aileron Executive Oak</div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
            <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Sold</div><div className="font-black text-base">42</div></div>
            <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Stock</div><div className="font-black text-base">24</div></div>
            <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">★</div><div className="font-black text-base">4.9</div></div>
          </div>
          <div className="mt-3 text-2xl font-black text-primary">205,800 MAD <span className="text-xs text-on-surface-variant font-normal">earned</span></div>
        </div>
      </div>

      {/* Recent orders + Messages */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-outline-variant">
            <h2 className="h-display text-lg">Orders to fulfill</h2>
            <button onClick={() => showToast('Seller orders view coming soon', 'info')} className="text-sm font-bold text-primary">All orders →</button>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant bg-surface-container-low">
              <tr><th className="text-left px-5 py-3">Order</th><th className="text-left py-3">Customer</th><th className="text-left py-3">Piece</th><th className="text-right py-3">Qty</th><th className="text-right py-3">Earnings</th><th className="text-left py-3 px-5">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              <tr className="bg-red-50/40"><td className="px-5 py-3 font-mono font-bold text-primary">#DK-00248</td><td>Rachid Moubarak</td><td>Aileron Executive Oak</td><td className="text-right font-bold">2</td><td className="text-right font-black">8,330 MAD</td><td className="px-5"><span className="chip bg-red-100 text-primary">Awaiting prep</span></td></tr>
              <tr><td className="px-5 py-3 font-mono font-bold text-primary">#DK-00245</td><td>Aïcha Talbi</td><td>Aileron Executive Oak</td><td className="text-right font-bold">2</td><td className="text-right font-black">8,330 MAD</td><td className="px-5"><span className="chip bg-blue-100 text-blue-700">In workshop</span></td></tr>
              <tr><td className="px-5 py-3 font-mono font-bold text-primary">#DK-00243</td><td>Laila Chraibi</td><td>Cube Modular Shelf</td><td className="text-right font-bold">6</td><td className="text-right font-black">12,690 MAD</td><td className="px-5"><span className="chip bg-purple-100 text-purple-700">Shipped</span></td></tr>
              <tr><td className="px-5 py-3 font-mono font-bold text-primary">#DK-00237</td><td>Sofia Filali</td><td>Brass Pivot Stool</td><td className="text-right font-bold">1</td><td className="text-right font-black">1,098 MAD</td><td className="px-5"><span className="chip bg-emerald-100 text-emerald-700">Delivered</span></td></tr>
            </tbody>
          </table>
        </div>

        <div className="col-span-4 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="h-display text-lg">Recent messages</h2>
            <span className="chip btn-grad text-xs">3 new</span>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center text-xs font-black flex-shrink-0">RM</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between"><div className="font-bold">Rachid M.</div><div className="text-[10px] text-on-surface-variant">2m</div></div>
                <div className="text-xs text-on-surface-variant truncate">Can you confirm the walnut grain selection before…</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5f5e5e] text-white grid place-items-center text-xs font-black flex-shrink-0">LC</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between"><div className="font-bold">Laila C. (B2B)</div><div className="text-[10px] text-on-surface-variant">1h</div></div>
                <div className="text-xs text-on-surface-variant truncate">{"We'd like 12 more shelves by Apr 15 — possible?"}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-on-surface text-white grid place-items-center text-xs font-black flex-shrink-0">YK</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between"><div className="font-bold">Desk+ Admin</div><div className="text-[10px] text-on-surface-variant">3h</div></div>
                <div className="text-xs text-on-surface-variant truncate">Spring catalog photo session confirmed for…</div>
              </div>
            </div>
          </div>
          <button onClick={() => showToast('Inbox coming soon', 'info')} className="block w-full mt-5 pt-4 border-t border-outline-variant text-center text-sm font-bold text-primary">Open inbox →</button>
        </div>
      </div>
    </>
  )
}
