import { useState, useRef } from 'react'
import { useAdminProducts } from '../hooks/useAdmin'
import { useUiStore } from '../store/uiStore'

function statusChip(product: any) {
  if (!product.is_active) return <span className="chip bg-gray-200 text-gray-700">Inactive</span>
  if (product.stock === 0) return <span className="chip bg-red-100 text-primary">Out</span>
  if (product.stock <= 5) return <span className="chip bg-amber-100 text-amber-700">Low stock</span>
  return <span className="chip bg-emerald-100 text-emerald-700">Active</span>
}

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const csvInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useUiStore()

  const { data, isLoading } = useAdminProducts({ search: search || undefined, status: statusFilter || undefined, page, per_page: 20 })
  const products: any[] = data?.data ?? []
  const meta = (data as any)?.meta ?? data
  const total = meta?.total ?? products.length
  const lastPage = meta?.last_page ?? 1
  const currentPage = meta?.current_page ?? page

  const activeCount = products.filter((p: any) => p.is_active && p.stock > 0).length
  const lowStockCount = products.filter((p: any) => p.stock > 0 && p.stock <= 5).length
  const outCount = products.filter((p: any) => p.stock === 0).length

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
          <p className="text-sm text-on-surface-variant">{total} product{total !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex gap-2">
          <a href="https://desk-cloud-nine.vercel.app/dashboard.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container text-sm font-semibold transition-colors"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>Desk+ Cloud</a>
          <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) showToast(`CSV "${e.target.files[0].name}" selected — import not yet implemented`, 'info'); e.target.value = '' }} />
          <button onClick={() => csvInputRef.current?.click()} className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>file_upload</span>Import CSV</button>
          <button onClick={() => { showToast('Exporting products...', 'info'); window.open(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api/admin/products?export=csv`, '_blank') }} className="border border-outline-variant bg-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>file_download</span>Export</button>
          <button onClick={() => showToast('New product form coming soon', 'info')} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2"><span className="material-symbols-outlined" style={{fontSize:18}}>add</span>New product</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Total SKUs</div><div className="text-2xl font-black mt-1">{total}</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft"><div className="text-xs uppercase tracking-widest-2 font-bold text-on-surface-variant">Active</div><div className="text-2xl font-black mt-1">{activeCount}</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft border-l-4 border-amber-500"><div className="text-xs uppercase tracking-widest-2 font-bold text-amber-700">Low stock</div><div className="text-2xl font-black mt-1">{lowStockCount}</div><div className="text-xs text-on-surface-variant mt-1">Reorder soon</div></div>
        <div className="bg-white rounded-xl p-5 shadow-soft border-l-4 border-primary"><div className="text-xs uppercase tracking-widest-2 font-bold text-primary">Out of stock</div><div className="text-2xl font-black mt-1">{outCount}</div><div className="text-xs text-on-surface-variant mt-1">Hidden from store</div></div>
      </div>

      {/* Cloud banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-fixed border border-outline-variant mb-4 text-sm">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>cloud_sync</span>
        <span className="text-on-surface-variant">Need to add products in bulk?</span>
        <a href="https://desk-cloud-nine.vercel.app/dashboard.html" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline ml-auto flex items-center gap-1">Open Desk+ Cloud<span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span></a>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="px-6 pt-5 flex items-center gap-1 border-b border-outline-variant">
          <button onClick={() => { setStatusFilter(''); setPage(1) }} className={`px-4 py-3 text-sm font-bold ${!statusFilter ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>All <span className="text-xs text-on-surface-variant">{total}</span></button>
          <button onClick={() => { setStatusFilter('active'); setPage(1) }} className={`px-4 py-3 text-sm font-semibold ${statusFilter === 'active' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>Active</button>
          <button onClick={() => { setStatusFilter('low_stock'); setPage(1) }} className={`px-4 py-3 text-sm font-semibold ${statusFilter === 'low_stock' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>Low stock</button>
          <button onClick={() => { setStatusFilter('out_of_stock'); setPage(1) }} className={`px-4 py-3 text-sm font-semibold ${statusFilter === 'out_of_stock' ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant'}`}>Out of stock</button>
        </div>
        <div className="p-5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span><input className="w-full pl-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant text-sm" placeholder="Search products, SKU..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} /></div>
          <div className="ml-auto text-sm text-on-surface-variant">Sort: <strong className="text-on-surface">Last edited</strong></div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-widest-2 text-on-surface-variant">
            <tr className="bg-surface-container-low border-y border-outline-variant">
              <th className="text-left px-6 py-3 w-8"><span className={`ck${selectedIds.size === products.length && products.length > 0 ? ' on' : ''}`} onClick={() => { if (selectedIds.size === products.length) setSelectedIds(new Set()); else setSelectedIds(new Set(products.map((p: any) => p.id))) }} style={{cursor:'pointer'}}></span></th>
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
            {products.map((product: any) => (
              <tr key={product.id}>
                <td className="px-6 py-3"><span className={`ck${selectedIds.has(product.id) ? ' on' : ''}`} onClick={() => { setSelectedIds(prev => { const next = new Set(prev); if (next.has(product.id)) next.delete(product.id); else next.add(product.id); return next }) }} style={{cursor:'pointer'}}></span></td>
                <td><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-lg bg-surface-container-high overflow-hidden">{product.images?.[0]?.url ? <img src={product.images[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full ph-walnut"></div>}</div><div><div className="font-semibold">{product.name}</div><div className="text-xs text-on-surface-variant">{product.seller?.name ?? 'Unknown seller'}</div></div></div></td>
                <td className="font-mono text-xs">{product.sku ?? '—'}</td>
                <td>{product.category?.name ?? '—'}</td>
                <td className="text-right font-bold">{(product.price ?? 0).toLocaleString()} MAD</td>
                <td className={`text-right ${product.stock <= 5 && product.stock > 0 ? 'text-amber-700 font-bold' : ''}`}>{product.stock}{product.stock <= 5 && product.stock > 0 ? <span className="text-xs"> &#9888;</span> : ''}</td>
                <td>{statusChip(product)}</td>
                <td className="px-6"><button><span className="material-symbols-outlined text-on-surface-variant">more_horiz</span></button></td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={8} className="px-6 py-8 text-center text-on-surface-variant">No products found</td></tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant text-sm">
          <div className="text-on-surface-variant">Showing page {currentPage} of {lastPage} ({total} total)</div>
          <div className="flex items-center gap-2">
            <button disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low disabled:opacity-30"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_left</span></button>
            {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 grid place-items-center rounded-lg font-semibold ${p === currentPage ? 'btn-grad text-white font-bold' : 'hover:bg-surface-container-low'}`}>{p}</button>
            ))}
            {lastPage > 5 && <span className="text-on-surface-variant">...</span>}
            {lastPage > 5 && <button onClick={() => setPage(lastPage)} className={`w-8 h-8 grid place-items-center rounded-lg font-semibold ${lastPage === currentPage ? 'btn-grad text-white font-bold' : 'hover:bg-surface-container-low'}`}>{lastPage}</button>}
            <button disabled={currentPage >= lastPage} onClick={() => setPage(p => Math.min(lastPage, p + 1))} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-surface-container-low disabled:opacity-30"><span className="material-symbols-outlined" style={{fontSize:18}}>chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  )
}
