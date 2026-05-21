import { useAdminProducts } from '../hooks/useAdmin'

export default function AdminProducts() {
  const { data, isLoading } = useAdminProducts()
  const products = data?.data ?? []

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
        <div>
          <h1 className="h-display text-3xl">Products</h1>
          <p className="text-sm text-on-surface-variant">142 active · 14 drafts · 6 archived</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>file_upload</span>Import CSV</button>
          <button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>file_download</span>Export</button>
          <button className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>New product</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Total SKUs</div><div className="text-2xl font-black mt-1">162</div><div className="text-xs text-emerald-700 mt-1">+8 this week</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">In stock</div><div className="text-2xl font-black mt-1">134</div><div className="text-xs text-on-surface-variant mt-1">83% availability</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft border-l-4 border-amber-500"><div className="text-xs uppercase tracking-widest-2 font-bold text-amber-700">Low stock</div><div className="text-2xl font-black mt-1">12</div><div className="text-xs text-on-surface-variant mt-1">Reorder soon</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft border-l-4 border-primary"><div className="text-xs uppercase tracking-widest-2 font-bold text-primary">Out of stock</div><div className="text-2xl font-black mt-1">16</div><div className="text-xs text-on-surface-variant mt-1">Hidden from store</div></div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 pt-5 flex items-center gap-1 border-b border-outline-variant">
          <button className="px-4 py-3 text-sm font-bold border-b-2 border-primary text-primary">All <span className="text-xs text-on-surface-variant">142</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Active <span className="text-xs">122</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Drafts <span className="text-xs">14</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Low stock <span className="chip bg-amber-100 text-amber-700">12</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Archived <span className="text-xs">6</span></button>
        </div>
        <div className="p-5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search products, SKU..." /></div>
          <button className="chip border border-outline-variant bg-white text-on-surface">Category: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="chip border border-outline-variant bg-white text-on-surface">Style: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <button className="chip border border-outline-variant bg-white text-on-surface">Space: All <span className="material-symbols-outlined" style={{fontSize:14}}>expand_more</span></button>
          <div className="ml-auto text-sm text-on-surface-variant">Sort: <strong className="text-on-surface">Last edited</strong></div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low border-y border-outline-variant">
              <th className="text-left px-6 py-3 w-8"><span className="ck"></span></th>
              <th className="text-left py-3">Product</th>
              <th className="text-left py-3">SKU</th>
              <th className="text-left py-3">Category</th>
              <th className="text-right py-3">Price</th>
              <th className="text-right py-3">Stock</th>
              <th className="text-left py-3">Status</th>
              <th className="px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            <tr><td className="px-6 py-3"><span className="ck on"><span className="material-symbols-outlined" style={{fontSize:14}}>check</span></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-walnut"></div><div><div className="font-semibold">Aileron Executive Oak</div><div className="text-xs text-on-surface-variant">Walnut · Statesman</div></div></div></td><td className="font-mono text-xs">DK-AIL-WL01</td><td>Desks</td><td className="text-right font-bold">4,900 MAD</td><td className="text-right">24</td><td><span className="chip bg-emerald-100 text-emerald-700">Active</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
            <tr className="bg-surface-container-low/40"><td className="px-6 py-3"><span className="ck on"><span className="material-symbols-outlined" style={{fontSize:14}}>check</span></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-mesh-chair"></div><div><div className="font-semibold">ErgoFlex Pro Mesh</div><div className="text-xs text-on-surface-variant">Carbon · Kendo Studio</div></div></div></td><td className="font-mono text-xs">DK-ERF-BK02</td><td>Chairs</td><td className="text-right font-bold">3,490 MAD</td><td className="text-right text-amber-700 font-bold">3 <span className="text-xs">&#9888;</span></td><td><span className="chip bg-amber-100 text-amber-700">Low stock</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
            <tr><td className="px-6 py-3"><span className="ck"></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-dark"></div><div><div className="font-semibold">Lumi Task Light</div><div className="text-xs text-on-surface-variant">Matte black · Hacker Lab</div></div></div></td><td className="font-mono text-xs">DK-LMI-BK01</td><td>Lighting</td><td className="text-right font-bold">1,290 MAD</td><td className="text-right">87</td><td><span className="chip bg-emerald-100 text-emerald-700">Active</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
            <tr><td className="px-6 py-3"><span className="ck"></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-cream"></div><div><div className="font-semibold">Linen Task Plus</div><div className="text-xs text-on-surface-variant">Bone · Coco</div></div></div></td><td className="font-mono text-xs">DK-LIN-CR01</td><td>Chairs</td><td className="text-right font-bold">1,890 MAD</td><td className="text-right">42</td><td><span className="chip bg-emerald-100 text-emerald-700">Active</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
            <tr><td className="px-6 py-3"><span className="ck"></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-warm"></div><div><div className="font-semibold">Brass Pivot Stool</div><div className="text-xs text-on-surface-variant">Aged brass · Atelier</div></div></div></td><td className="font-mono text-xs">DK-BPS-BR02</td><td>Seating</td><td className="text-right font-bold">1,290 MAD</td><td className="text-right">0</td><td><span className="chip bg-red-100 text-primary">Out</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
            <tr><td className="px-6 py-3"><span className="ck"></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-wood"></div><div><div className="font-semibold">Cube Modular Shelf</div><div className="text-xs text-on-surface-variant">Oak · Economie</div></div></div></td><td className="font-mono text-xs">DK-CMS-OK04</td><td>Storage</td><td className="text-right font-bold">2,490 MAD</td><td className="text-right">18</td><td><span className="chip bg-emerald-100 text-emerald-700">Active</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
            <tr><td className="px-6 py-3"><span className="ck"></span></td><td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg ph-charcoal"></div><div><div className="font-semibold">Aero Stealth Mesh</div><div className="text-xs text-on-surface-variant">Carbon · Hacker</div></div></div></td><td className="font-mono text-xs">DK-AER-BK01</td><td>Chairs</td><td className="text-right font-bold">2,890 MAD</td><td className="text-right">31</td><td><span className="chip bg-gray-200 text-gray-700">Draft</span></td><td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td></tr>
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant text-sm">
          <div className="text-on-surface-variant">Showing 1–7 of 142</div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_left</span></button>
            <button className="w-8 h-8 grid place-items-center rounded-lg btn-grad text-white font-bold">1</button>
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low font-semibold">2</button>
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low font-semibold">3</button>
            <span className="text-on-surface-variant">...</span>
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low font-semibold">21</button>
            <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1c1b1b] text-white rounded-xl shadow-ambient px-5 py-3 flex items-center gap-4 text-sm">
        <strong>2 selected</strong>
        <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Edit price</button>
        <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Tag</button>
        <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20">Duplicate</button>
        <button className="px-3 py-1.5 rounded-lg bg-primary text-white">Archive</button>
        <button className="text-white/60 hover:text-white"><span className="material-symbols-outlined" style={{fontSize:18}}>close</span></button>
      </div>
    </>
  )
}
