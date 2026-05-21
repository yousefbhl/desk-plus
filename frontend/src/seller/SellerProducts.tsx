import { useSellerProducts } from '../hooks/useSeller'

export default function SellerProducts() {
  const { data, isLoading } = useSellerProducts()

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
          <h1 className="h-display text-3xl">My Pieces</h1>
          <p className="text-sm text-on-surface-variant">42 active · 3 drafts · 1 archived</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>file_upload</span>Bulk upload</button>
          <button className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>New piece</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-soft mb-6">
        <div className="flex items-center gap-1 px-5 pt-4 border-b border-outline-variant">
          <button className="px-4 py-3 text-sm font-bold border-b-2 border-primary text-primary">Active <span className="text-xs text-on-surface-variant">42</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Drafts <span className="text-xs">3</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Low stock <span className="chip bg-amber-100 text-amber-700">2</span></button>
          <button className="px-4 py-3 text-sm font-semibold text-on-surface-variant">Archived <span className="text-xs">1</span></button>
        </div>
        <div className="p-5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search my pieces…" /></div>
          <button className="chip border border-outline-variant bg-white">Category <span className="material-symbols-outlined" style={{ fontSize: 14 }}>expand_more</span></button>
          <div className="ml-auto flex bg-surface-container-high rounded-lg p-1">
            <button className="px-2.5 py-1 rounded-md bg-surface-container-lowest shadow-soft"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>grid_view</span></button>
            <button className="px-2.5 py-1 text-on-surface-variant"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>view_list</span></button>
          </div>
        </div>
      </div>

      {/* Product cards grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Card */}
        <div className="bg-white rounded-xl overflow-hidden shadow-soft">
          <div className="aspect-[4/3] ph-walnut relative">
            <span className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Top seller</span>
            <div className="absolute top-3 right-3 flex gap-1">
              <button className="w-8 h-8 rounded-full bg-white/90 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span></button>
              <button className="w-8 h-8 rounded-full bg-white/90 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>more_vert</span></button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Desk · Walnut</div>
                <div className="font-bold mt-0.5">Aileron Executive Oak</div>
                <div className="text-xs font-mono text-on-surface-variant mt-0.5">DK-AIL-WL01</div>
              </div>
              <span className="chip bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Price</div><div className="font-black text-sm text-primary">4,900</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Stock</div><div className="font-black text-sm">24</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Sold</div><div className="font-black text-sm">42</div></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">★ 4.9 · 86 reviews</span>
              <span className="text-emerald-700 font-bold">↑ 32% MoM</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-soft">
          <div className="aspect-[4/3] ph-wood relative">
            <div className="absolute top-3 right-3 flex gap-1">
              <button className="w-8 h-8 rounded-full bg-white/90 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span></button>
              <button className="w-8 h-8 rounded-full bg-white/90 grid place-items-center"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>more_vert</span></button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Storage · Oak</div>
                <div className="font-bold mt-0.5">Cube Modular Shelf</div>
                <div className="text-xs font-mono text-on-surface-variant mt-0.5">DK-CMS-OK04</div>
              </div>
              <span className="chip bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Price</div><div className="font-black text-sm text-primary">2,490</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Stock</div><div className="font-black text-sm">18</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Sold</div><div className="font-black text-sm">24</div></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">★ 4.7 · 24 reviews</span>
              <span className="text-emerald-700 font-bold">↑ 14%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-soft ring-2 ring-amber-400">
          <div className="aspect-[4/3] ph-warm relative">
            <span className="absolute top-3 left-3 chip bg-amber-500 text-white uppercase tracking-widest-2">Low stock</span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Stool · Brass</div>
                <div className="font-bold mt-0.5">Brass Pivot Stool</div>
                <div className="text-xs font-mono text-on-surface-variant mt-0.5">DK-BPS-BR02</div>
              </div>
              <span className="chip bg-amber-100 text-amber-700">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Price</div><div className="font-black text-sm text-primary">1,290</div></div>
              <div className="bg-amber-50 rounded-lg p-2"><div className="text-amber-700 uppercase tracking-widest-2">Stock</div><div className="font-black text-sm text-amber-800">3 ⚠</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Sold</div><div className="font-black text-sm">18</div></div>
            </div>
            <button className="mt-4 w-full btn-grad text-white font-bold py-2 rounded-lg text-xs uppercase tracking-widest-2">Restock now</button>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-soft">
          <div className="aspect-[4/3] ph-walnut relative"></div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Credenza · Walnut</div><div className="font-bold mt-0.5">Bensaïd Credenza Mk II</div><div className="text-xs font-mono text-on-surface-variant mt-0.5">DK-BCR-WL01</div></div>
              <span className="chip bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Price</div><div className="font-black text-sm text-primary">6,800</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Stock</div><div className="font-black text-sm">8</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Sold</div><div className="font-black text-sm">14</div></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">★ 4.8 · 18 reviews</span>
              <span className="text-on-surface-variant font-bold">— flat</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden shadow-soft">
          <div className="aspect-[4/3] ph-wood relative"></div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div><div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Desk · Oak</div><div className="font-bold mt-0.5">Atelier Sit-Stand</div><div className="text-xs font-mono text-on-surface-variant mt-0.5">DK-ASS-OK02</div></div>
              <span className="chip bg-emerald-100 text-emerald-700">Active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Price</div><div className="font-black text-sm text-primary">8,200</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Stock</div><div className="font-black text-sm">12</div></div>
              <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Sold</div><div className="font-black text-sm">9</div></div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs"><span className="text-on-surface-variant">★ 4.9 · 12 reviews</span><span className="text-emerald-700 font-bold">↑ 22%</span></div>
          </div>
        </div>

        {/* Draft */}
        <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-soft border-2 border-dashed border-outline-variant">
          <div className="aspect-[4/3] bg-surface-container-high relative grid place-items-center">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>image</span>
            <span className="absolute top-3 left-3 chip bg-gray-200 text-gray-700 uppercase tracking-widest-2">Draft</span>
          </div>
          <div className="p-5">
            <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">Untitled · Desk</div>
            <div className="font-bold mt-0.5 text-on-surface-variant">Awaiting photography</div>
            <div className="text-xs text-on-surface-variant mt-3">Created 2 days ago · 60% complete</div>
            <div className="mt-2 h-2 bg-surface-container-high rounded-full"><div className="h-full w-3/5 btn-grad rounded-full"></div></div>
            <button className="mt-4 w-full border border-outline-variant bg-white font-bold py-2 rounded-lg text-xs uppercase tracking-widest-2">Continue editing</button>
          </div>
        </div>
      </div>

      {/* Edit slide-over preview */}
      <div className="mt-12">
        <div className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant mb-3">Slide-over (preview)</div>
        <div className="bg-white rounded-xl shadow-ambient max-w-2xl ml-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
            <div><div className="text-xs font-bold uppercase tracking-widest-2 text-primary">Edit piece</div><div className="font-bold text-lg">Aileron Executive Oak</div></div>
            <button className="w-9 h-9 rounded-full hover:bg-surface-container-low grid place-items-center"><span className="material-symbols-outlined">close</span></button>
          </div>
          <div className="p-6 space-y-5">
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center text-sm">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 32 }}>cloud_upload</span>
              <div className="font-bold mt-1">Drop photos here</div>
              <div className="text-xs text-on-surface-variant">PNG/JPG up to 10MB · First image becomes the cover</div>
              <div className="flex justify-center gap-2 mt-4">
                <div className="w-14 h-14 rounded-lg ph-walnut relative"><span className="absolute -top-1 -right-1 w-4 h-4 rounded-full btn-grad text-white text-[10px] grid place-items-center">★</span></div>
                <div className="w-14 h-14 rounded-lg ph-wood"></div>
                <div className="w-14 h-14 rounded-lg ph-warm"></div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest-2">Name</label>
              <input className="field mt-2" defaultValue="Aileron Executive Oak" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-bold uppercase tracking-widest-2">Price (MAD)</label><input className="field mt-2" defaultValue="4900" /></div>
              <div><label className="text-xs font-bold uppercase tracking-widest-2">Stock</label><input className="field mt-2" defaultValue="24" /></div>
              <div><label className="text-xs font-bold uppercase tracking-widest-2">SKU</label><input className="field mt-2 font-mono" defaultValue="DK-AIL-WL01" /></div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest-2 mb-2">Variants</div>
              <div className="bg-surface-container-low rounded-lg p-3 flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#7c4a3a]"></span>
                <input className="flex-1 bg-transparent text-sm font-semibold outline-none" defaultValue="Walnut" />
                <input className="w-16 bg-surface-container-lowest rounded p-1 text-sm" defaultValue="12" />
                <button><span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>delete</span></button>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#b67a64]"></span>
                <input className="flex-1 bg-transparent text-sm font-semibold outline-none" defaultValue="Honey oak" />
                <input className="w-16 bg-surface-container-lowest rounded p-1 text-sm" defaultValue="12" />
                <button><span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>delete</span></button>
              </div>
              <button className="mt-2 text-sm font-bold text-primary">+ Add variant</button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-outline-variant">
            <button className="text-sm font-semibold text-on-surface-variant">Cancel</button>
            <button className="border border-outline-variant font-semibold px-4 py-2 rounded-lg text-sm">Save as draft</button>
            <button className="btn-grad text-white font-bold px-5 py-2 rounded-lg text-sm uppercase tracking-widest-2">Publish</button>
          </div>
        </div>
      </div>
    </>
  )
}
