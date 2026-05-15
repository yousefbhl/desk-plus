import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi, catalogApi } from '../api'
import ProductCard from '../components/ui/ProductCard'
import { ProductGridSkeleton } from '../components/ui/Skeleton'
import type { Category, Space, Taste } from '../types'

const SORT_OPTIONS = [
  { value: '',         label: 'Most Relevant' },
  { value: 'newest',  label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 50000])

  const filters = {
    search:      params.get('search')      ?? undefined,
    category_id: params.get('category_id') ?? undefined,
    space_id:    params.get('space_id')    ?? undefined,
    taste_id:    params.get('taste_id')    ?? undefined,
    sort:        params.get('sort')        ?? undefined,
    min_price:   params.get('min_price')   ?? undefined,
    max_price:   params.get('max_price')   ?? undefined,
    page:        params.get('page')        ?? '1',
    per_page:    '16',
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters).then((r) => r.data),
  })

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => catalogApi.categories().then((r) => r.data) })
  const { data: spaces }     = useQuery({ queryKey: ['spaces'],     queryFn: () => catalogApi.spaces().then((r) => r.data) })
  const { data: tastes }     = useQuery({ queryKey: ['tastes'],     queryFn: () => catalogApi.tastes().then((r) => r.data) })

  const setFilter = (key: string, val: string | undefined) => {
    setParams((p) => {
      const n = new URLSearchParams(p)
      if (val) n.set(key, val); else n.delete(key)
      n.set('page', '1')
      return n
    })
  }

  const clearAll = () => setParams({})

  const products = data?.data ?? []
  const meta     = data
  const hasFilters = [...params.entries()].filter(([k]) => k !== 'page').length > 0

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest-2 text-primary mb-1">
          {filters.search ? `Results for "${filters.search}"` : 'Collection'}
        </p>
        <h1 className="h-display text-4xl">
          {filters.search ? filters.search.toUpperCase() : 'ALL PRODUCTS'}
        </h1>
        {meta?.total !== undefined && (
          <p className="text-on-surface-variant text-sm mt-1">{meta.total} products found</p>
        )}
      </div>

      <div className="flex gap-8">
        {/* ── SIDEBAR ── */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="bg-surface-container-lowest rounded-xl shadow-ambient p-6 sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest-2">Filters</p>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-primary font-semibold hover:underline">Clear all</button>
              )}
            </div>

            {/* Category */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest-2 text-on-surface-variant mb-3">Category</p>
              <div className="space-y-2">
                {((categories as Category[]) ?? []).map((c) => (
                  <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`ck ${filters.category_id === String(c.id) ? 'on' : ''}`}
                      onClick={() => setFilter('category_id', filters.category_id === String(c.id) ? undefined : String(c.id))}
                    >
                      {filters.category_id === String(c.id) && (
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>check</span>
                      )}
                    </div>
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Space */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest-2 text-on-surface-variant mb-3">Space</p>
              <div className="space-y-2">
                {((spaces as Space[]) ?? []).slice(0, 6).map((s) => (
                  <label key={s.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`ck ${filters.space_id === String(s.id) ? 'on' : ''}`}
                      onClick={() => setFilter('space_id', filters.space_id === String(s.id) ? undefined : String(s.id))}
                    >
                      {filters.space_id === String(s.id) && (
                        <span className="material-symbols-outlined text-white" style={{ fontSize: 12 }}>check</span>
                      )}
                    </div>
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Taste */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest-2 text-on-surface-variant mb-3">Style</p>
              <div className="flex flex-wrap gap-2">
                {((tastes as Taste[]) ?? []).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFilter('taste_id', filters.taste_id === String(t.id) ? undefined : String(t.id))}
                    className={`chip text-xs transition-all ${filters.taste_id === String(t.id) ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest-2 text-on-surface-variant mb-3">Price Range</p>
              <div className="space-y-3">
                <input
                  type="range" min="0" max="50000" step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, +e.target.value])}
                  onMouseUp={() => setFilter('max_price', String(priceRange[1]))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>0 MAD</span>
                  <span className="font-bold text-on-surface">{priceRange[1].toLocaleString()} MAD</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── PRODUCTS ── */}
        <div className="flex-1 min-w-0">
          {/* Sort + count bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <p className="text-sm text-on-surface-variant">{data?.total ?? 0} products</p>
            <select
              value={filters.sort ?? ''}
              onChange={(e) => setFilter('sort', e.target.value || undefined)}
              className="field !h-10 !w-auto !bg-surface-container-high text-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={16} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 56 }}>search_off</span>
              <p className="font-bold text-xl">No products found</p>
              <p className="text-on-surface-variant text-sm max-w-xs">Try adjusting your filters or search terms</p>
              <button onClick={clearAll} className="btn-grad px-6 py-2.5 rounded-xl font-semibold text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {meta && (meta.last_page ?? 1) > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: meta.last_page ?? 1 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setFilter('page', String(n))}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${meta.current_page === n ? 'bg-primary text-white' : 'bg-surface-container-high hover:bg-surface-container-highest'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
