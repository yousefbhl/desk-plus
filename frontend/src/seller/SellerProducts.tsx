import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sellerApi, catalogApi } from '../api'
import { uploadProductImage } from '../lib/supabaseUpload'
import { useToastStore } from '../store/toastStore'

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n || 0))

const TABS = [
  { key: '',       label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'low',    label: 'Low stock' },
  { key: 'out',    label: 'Out of stock' },
  { key: 'drafts', label: 'Drafts' },
]

const SORTS = [
  { key: 'newest',     label: 'Newest' },
  { key: 'oldest',     label: 'Oldest' },
  { key: 'price_desc', label: 'Price: High → Low' },
  { key: 'price_asc',  label: 'Price: Low → High' },
  { key: 'stock_asc',  label: 'Stock: Low → High' },
]

export default function SellerProducts() {
  const qc = useQueryClient()
  const { show } = useToastStore()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [sort,   setSort]   = useState('newest')
  const [showForm, setShowForm] = useState(false)
  const [restockId, setRestockId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['seller-products', search, filter, sort],
    queryFn: () => sellerApi.products({ search, filter, sort }),
  })

  const products = data?.data ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="h-display text-3xl">My Pieces</h1>
          <p className="text-sm text-on-surface-variant">{data?.meta?.total ?? products.length} products</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          New piece
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-ambient mb-6">
        <div className="flex items-center gap-1 px-5 pt-4 border-b border-outline-variant overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${filter === t.key ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
            <input className="field !pl-9 !h-10" placeholder="Search my pieces…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !h-10 !w-auto">
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
              <div className="aspect-[4/3] bg-surface-container-high animate-pulse" />
              <div className="p-5 space-y-3"><div className="h-4 bg-surface-container-high rounded animate-pulse" /><div className="h-10 bg-surface-container-high rounded animate-pulse" /></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-xl shadow-ambient">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 56 }}>inventory_2</span>
          <p className="h-display text-2xl mt-4">No products yet</p>
          <p className="text-on-surface-variant mt-1">Add your first piece to start selling.</p>
          <button onClick={() => setShowForm(true)} className="btn-grad text-white font-bold px-5 py-2.5 rounded-xl text-sm uppercase tracking-widest-2 mt-5 inline-flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> New piece
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((p: any) => {
            const stockChip = p.stock === 0 ? 'bg-red-100 text-primary' : p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            const stockLabel = p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? 'Low stock' : 'Active'
            return (
              <div key={p.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
                <div className="aspect-[4/3] bg-surface-container-high relative overflow-hidden">
                  {p.images?.[0]?.url
                    ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full grid place-items-center"><span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 40 }}>chair</span></div>}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="text-xs text-on-surface-variant uppercase tracking-widest-2 truncate">{p.category?.name ?? '—'}</div>
                      <div className="font-bold mt-0.5 truncate">{p.name}</div>
                      {p.sku && <div className="text-xs font-mono text-on-surface-variant mt-0.5">{p.sku}</div>}
                    </div>
                    <span className={`chip shrink-0 ${stockChip}`}>{stockLabel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Price</div><div className="font-black text-sm text-primary">{fmt(p.price)}</div></div>
                    <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">Stock</div><div className="font-black text-sm">{p.stock}</div></div>
                    <div className="bg-surface-container-low rounded-lg p-2"><div className="text-on-surface-variant uppercase tracking-widest-2">★</div><div className="font-black text-sm">{p.avg_rating ?? 0}</div></div>
                  </div>
                  <button onClick={() => setRestockId(p.id)} className="mt-4 w-full border border-outline-variant hover:border-primary hover:text-primary font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>inventory</span> Restock
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && <NewProductDrawer onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); qc.invalidateQueries({ queryKey: ['seller-products'] }); qc.invalidateQueries({ queryKey: ['seller-dashboard'] }) }} />}
      {restockId !== null && <RestockModal productId={restockId} current={products.find((p: any) => p.id === restockId)?.stock ?? 0} onClose={() => setRestockId(null)} onSaved={() => { setRestockId(null); qc.invalidateQueries({ queryKey: ['seller-products'] }) }} />}
    </div>
  )
}

/* ── Restock modal ─────────────────────────────────────────── */
function RestockModal({ productId, current, onClose, onSaved }: { productId: number; current: number; onClose: () => void; onSaved: () => void }) {
  const { show } = useToastStore()
  const [stock, setStock] = useState(String(current))
  const mut = useMutation({
    mutationFn: () => sellerApi.updateStock(productId, parseInt(stock, 10)),
    onSuccess: () => { show('Stock updated', 'success'); onSaved() },
    onError: (e: any) => show(e?.response?.data?.message ?? 'Could not update stock', 'error'),
  })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-surface-container-lowest rounded-2xl shadow-ambient w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="h-display text-xl mb-1">Restock</h3>
        <p className="text-sm text-on-surface-variant mb-4">Set the new stock quantity.</p>
        <input type="number" min={0} className="field" value={stock} onChange={(e) => setStock(e.target.value)} autoFocus />
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 border border-outline-variant font-semibold py-2.5 rounded-lg text-sm">Cancel</button>
          <button onClick={() => mut.mutate()} disabled={mut.isPending} className="flex-1 btn-grad text-white font-bold py-2.5 rounded-lg text-sm">{mut.isPending ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}

/* ── New product slide-over (Supabase image + Laravel create) ── */
function NewProductDrawer({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { show } = useToastStore()
  const [form, setForm] = useState({ name: '', description: '', price: '', compare_price: '', sku: '', stock: '', category_id: '' })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { data: catsRes } = useQuery({ queryKey: ['categories'], queryFn: () => catalogApi.categories().then((r: any) => r.data) })
  const categories = catsRes?.data ?? catsRes ?? []

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const onFile = (f: File | null) => {
    setFile(f)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const submit = async () => {
    if (!form.name || !form.price || !form.stock || !form.category_id) {
      show('Name, price, stock and category are required', 'error'); return
    }
    setSaving(true)
    try {
      // 1) upload image to Supabase (if any)
      let image_url: string | null = null
      if (file) {
        show('Uploading image…', 'success')
        image_url = await uploadProductImage(file)
      }
      // 2) create product via Laravel
      await sellerApi.createProduct({
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        sku: form.sku || null,
        stock: parseInt(form.stock, 10),
        category_id: parseInt(form.category_id, 10),
        image_url,
        is_active: true,
      })
      show('Product published!', 'success')
      onSaved()
    } catch (e: any) {
      show(e?.response?.data?.message ?? e?.message ?? 'Could not create product', 'error')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div className="bg-surface-container-lowest w-full max-w-lg h-full overflow-y-auto shadow-ambient" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant sticky top-0 bg-surface-container-lowest z-10">
          <h2 className="h-display text-xl">New piece</h2>
          <button onClick={onClose}><span className="material-symbols-outlined text-on-surface-variant">close</span></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Image */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest-2 mb-2 text-on-surface-variant">Product image</label>
            <label className="block aspect-[4/3] rounded-xl border-2 border-dashed border-outline-variant hover:border-primary cursor-pointer overflow-hidden relative transition-colors">
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                : <div className="w-full h-full grid place-items-center text-on-surface-variant"><div className="text-center"><span className="material-symbols-outlined" style={{ fontSize: 40 }}>add_photo_alternate</span><div className="text-sm mt-1">Click to upload</div></div></div>}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Name *</label>
            <input className="field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Aileron Executive Oak" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Description</label>
            <textarea className="field !h-24 resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the piece…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Price (MAD) *</label>
              <input type="number" className="field" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="4900" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Compare price</label>
              <input type="number" className="field" value={form.compare_price} onChange={(e) => set('compare_price', e.target.value)} placeholder="optional" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Stock *</label>
              <input type="number" className="field" value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="24" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">SKU</label>
              <input className="field font-mono" value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="DK-AIL-WL01" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest-2 mb-1.5 text-on-surface-variant">Category *</label>
            <select className="field" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">Select category…</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-outline-variant sticky bottom-0 bg-surface-container-lowest">
          <button onClick={onClose} className="text-sm font-semibold text-on-surface-variant px-4 py-2">Cancel</button>
          <button onClick={submit} disabled={saving} className="btn-grad text-white font-bold px-5 py-2.5 rounded-lg text-sm uppercase tracking-widest-2 disabled:opacity-60">
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}