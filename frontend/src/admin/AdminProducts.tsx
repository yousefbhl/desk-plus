import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, catalogApi } from '../api'
import { TableRowSkeleton } from '../components/ui/Skeleton'
import { useToastStore } from '../store/toastStore'
import type { Category } from '../types'

const EMPTY_FORM = { name: '', description: '', price: '', compare_price: '', stock: '', category_id: '', sku: '', is_active: true, is_featured: false }

export default function AdminProducts() {
  const [search, setSearch]   = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing]     = useState<any | null>(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const qc = useQueryClient()
  const { show } = useToastStore()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => adminApi.products({ search: search || undefined, per_page: 20 }).then((r) => r.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => catalogApi.categories().then((r) => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: (payload: any) =>
      editing ? adminApi.updateProduct(editing.id, payload) : adminApi.createProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      show(editing ? 'Product updated' : 'Product created', 'success')
      closePanel()
    },
    onError: (err: any) => show(err?.response?.data?.message ?? 'Error saving product', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); show('Product deleted', 'success') },
  })

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setPanelOpen(true) }
  const openEdit   = (p: any) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', price: String(p.price), compare_price: String(p.compare_price ?? ''), stock: String(p.stock), category_id: String(p.category_id ?? ''), sku: p.sku ?? '', is_active: p.is_active, is_featured: p.is_featured })
    setPanelOpen(true)
  }
  const closePanel = () => { setPanelOpen(false); setEditing(null) }
  const setF = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSave = () => {
    const payload = { ...form, price: +form.price, compare_price: form.compare_price ? +form.compare_price : null, stock: +form.stock, category_id: form.category_id ? +form.category_id : null }
    saveMutation.mutate(payload)
  }

  const products = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">Manage</p>
          <h1 className="h-display text-4xl">PRODUCTS</h1>
        </div>
        <button onClick={openCreate} className="btn-grad px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          New Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 18 }}>search</span>
        <input className="field !pl-9 !h-10" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-widest-2 text-on-surface-variant border-b border-outline-variant/60">
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-right px-4 py-3">Price</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16 text-on-surface-variant">No products found</td></tr>
            ) : products.map((p: any) => (
              <tr key={p.id} className="border-b border-outline-variant/40 hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container shrink-0 overflow-hidden">
                      {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full ph" />}
                    </div>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-on-surface-variant">{p.sku ?? '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{p.category?.name ?? '—'}</td>
                <td className="px-4 py-3 text-right font-bold">{p.price.toLocaleString()} MAD</td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${p.stock === 0 ? 'text-primary' : p.stock < 5 ? 'text-amber-600' : 'text-green-700'}`}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`chip text-xs ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {p.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg hover:bg-surface-container-high grid place-items-center text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                    </button>
                    <button onClick={() => { if (confirm('Delete product?')) deleteMutation.mutate(p.id) }} className="w-8 h-8 rounded-lg hover:bg-red-50 grid place-items-center text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 bg-on-surface/20 z-40" onClick={closePanel} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-surface-container-lowest shadow-ambient-lg flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
              <h2 className="font-black text-lg">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closePanel} className="w-8 h-8 grid place-items-center rounded-full hover:bg-surface-container-high">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {[['name', 'Product Name', 'text'], ['sku', 'SKU', 'text'], ['price', 'Price (MAD)', 'number'], ['compare_price', 'Compare Price (MAD)', 'number'], ['stock', 'Stock', 'number']].map(([k, label, type]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">{label}</label>
                  <input type={type} className="field" value={(form as any)[k]} onChange={setF(k as any)} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Category</label>
                <select className="field cursor-pointer" value={form.category_id} onChange={setF('category_id')}>
                  <option value="">No category</option>
                  {((categories as Category[]) ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Description</label>
                <textarea className="field !h-24 py-3" value={form.description} onChange={setF('description')} />
              </div>
              <div className="flex gap-4">
                {[['is_active', 'Active'], ['is_featured', 'Featured']].map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`ck ${(form as any)[k] ? 'on' : ''}`}
                      onClick={() => setForm((f) => ({ ...f, [k]: !(f as any)[k] }))}
                    >
                      {(form as any)[k] && <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>check</span>}
                    </div>
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant flex gap-3">
              <button onClick={closePanel} className="flex-1 py-3 rounded-xl font-bold border-2 border-outline-variant hover:bg-surface-container-high transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1 btn-grad py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                {saveMutation.isPending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (editing ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
