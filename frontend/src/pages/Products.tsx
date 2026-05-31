import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCatalog'
import { useWishlistStore } from '../store/wishlistStore'
import { useToggleWishlist } from '../hooks/useWishlist'
import { useAuthStore } from '../store/authStore'
import type { Category, Product, ProductFilters } from '../types'

function formatPrice(price: number): string {
  return price.toLocaleString('fr-MA') + ' MAD'
}

const STYLE_OPTIONS = [
  { label: 'Kendo', slug: 'kendo' },
  { label: 'Woody', slug: 'woody' },
  { label: 'Coco', slug: 'coco' },
  { label: 'Hacker', slug: 'hacker' },
  { label: 'Atelier', slug: 'atelier' },
] as const

const COLOR_OPTIONS: readonly { hex: string; slug: string; border?: boolean }[] = [
  { hex: '#1c1b1b', slug: 'black' },
  { hex: '#5f5e5e', slug: 'grey' },
  { hex: '#7c4a3a', slug: 'brown' },
  { hex: '#b67a64', slug: 'tan' },
  { hex: '#e2dfde', slug: 'cream', border: true },
  { hex: 'white', slug: 'white', border: true },
  { hex: '#ba0a0d', slug: 'red' },
]



const MATERIAL_OPTIONS = ['Oak', 'Walnut', 'Mesh', 'Steel', 'Leather', 'Linen'] as const

const SORT_OPTIONS = [
  { label: 'Featured', value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Popular', value: 'popular' },
] as const

export default function Products() {
  const [searchParams] = useSearchParams()
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || '')
  const [tasteFilter, setTasteFilter] = useState<string>(searchParams.get('taste') || '')
  const [spaceFilter, setSpaceFilter] = useState<string>(searchParams.get('space') || '')
  const [sortFilter, setSortFilter] = useState<string>(searchParams.get('sort') || 'newest')
  const [colorFilter, setColorFilter] = useState<string>(searchParams.get('color') || '')
  const [materialFilter, setMaterialFilter] = useState<string>(searchParams.get('material') || '')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [page, setPage] = useState(1)
  const wishlistStore = useWishlistStore()
  const toggleWishlist = useToggleWishlist()
  const authStore = useAuthStore()

  const filters: ProductFilters = {
    search: searchParams.get('search') || undefined,
    category: categoryFilter || undefined,
    taste: tasteFilter || undefined,
    space: spaceFilter || undefined,
    sort: sortFilter || undefined,
    color: colorFilter || undefined,
    material: materialFilter || undefined,
    min_price: minPrice > 0 ? minPrice : undefined,
    max_price: maxPrice < 50000 ? maxPrice : undefined,
    page,
    per_page: 12,
  }

  const { data, isLoading, isError, error } = useProducts(filters)
  const { data: categories } = useCategories() as { data: Category[] | undefined }

  const products = data?.data ?? []
  const meta = (data as any)?.meta
  const totalProducts = meta?.total ?? data?.total ?? 0
  const lastPage = meta?.last_page ?? data?.last_page ?? 1

  return (
    <div>
      {/* Heading + breadcrumb */}
      <section className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <div className="text-xs text-on-surface-variant mb-3 flex items-center gap-2">
            <Link to="/" className="hover:text-on-surface">Home</Link><span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="font-semibold text-on-surface">Products</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest-2 text-xs mb-2">The catalog</p>
              <h1 className="h-display text-5xl">All pieces.</h1>
              <p className="text-sm text-on-surface-variant mt-2">{totalProducts} hand-picked products from Moroccan ateliers</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`chip ${!categoryFilter ? 'btn-grad' : 'bg-surface-container-high'} uppercase tracking-widest-2`}
                onClick={() => { setCategoryFilter(''); setPage(1) }}
              >All</button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  className={`chip ${categoryFilter === cat.slug ? 'btn-grad' : 'bg-surface-container-high'}`}
                  onClick={() => { setCategoryFilter(cat.slug); setPage(1) }}
                >{cat.name}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Filters */}
          <aside className="col-span-3">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <div className="text-xs font-bold uppercase tracking-widest-2">Filters</div>
                <button className="text-xs font-semibold text-primary" onClick={() => { setCategoryFilter(''); setTasteFilter(''); setSpaceFilter(''); setSortFilter('newest'); setColorFilter(''); setMaterialFilter(''); setMinPrice(0); setMaxPrice(50000); setPage(1) }}>Reset</button>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3 flex items-center justify-between">Price range <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>expand_less</span></div>
                <div className="price-slider-wrapper">
                  <div className="price-slider-track" />
                  <div
                    className="price-slider-range"
                    style={{ left: `${(minPrice / 50000) * 100}%`, width: `${((maxPrice - minPrice) / 50000) * 100}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={100}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 500)
                      setMinPrice(val)
                      setPage(1)
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 500)
                      setMaxPrice(val)
                      setPage(1)
                    }}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <div className="flex-1 bg-surface-container-low rounded-lg p-2 text-xs"><div className="text-on-surface-variant">Min</div><div className="font-bold">{minPrice.toLocaleString()} MAD</div></div>
                  <div className="flex-1 bg-surface-container-low rounded-lg p-2 text-xs"><div className="text-on-surface-variant">Max</div><div className="font-bold">{maxPrice.toLocaleString()} MAD</div></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Style</div>
                <div className="space-y-2">
                  {STYLE_OPTIONS.map((style) => (
                    <label key={style.slug} className="flex items-center justify-between text-sm" onClick={() => { setTasteFilter(tasteFilter === style.slug ? '' : style.slug); setPage(1) }}><span className="flex items-center gap-2"><span className={`ck${tasteFilter === style.slug ? ' on' : ''}`}>{tasteFilter === style.slug && <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>}</span>{style.label}</span><span className="text-on-surface-variant text-xs"></span></label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Color</div>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.slug}
                      className={`w-7 h-7 rounded-full bg-[${c.hex}]${c.border ? ' border border-outline-variant' : ''}${colorFilter === c.slug ? ' ring-active' : ''}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => { setColorFilter(colorFilter === c.slug ? '' : c.slug); setPage(1) }}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Material</div>
                <div className="flex flex-wrap gap-2">
                  {MATERIAL_OPTIONS.map((mat) => (
                    <button
                      key={mat}
                      className={`chip ${materialFilter === mat.toLowerCase() ? 'btn-grad' : 'bg-surface-container-high'}`}
                      onClick={() => { setMaterialFilter(materialFilter === mat.toLowerCase() ? '' : mat.toLowerCase()); setPage(1) }}
                    >{mat}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Atelier</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm"><span className="ck"></span>Atelier Bensaïd</label>
                  <label className="flex items-center gap-2 text-sm"><span className="ck on"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span></span>Kendo Studio</label>
                  <label className="flex items-center gap-2 text-sm"><span className="ck"></span>Maison Lalla</label>
                  <label className="flex items-center gap-2 text-sm"><span className="ck"></span>Hacker Lab</label>
                  <label className="flex items-center gap-2 text-sm"><span className="ck"></span>Coco Souk</label>
                  <a className="text-xs text-primary font-bold">+ 23 more</a>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold mb-3">Availability</div>
                <label className="flex items-center gap-2 text-sm mb-2"><span className="ck on"><span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span></span>In stock</label>
                <label className="flex items-center gap-2 text-sm"><span className="ck"></span>Ships within 7 days</label>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="col-span-9">
            {/* Sort + count */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-sm">
                <strong>{totalProducts} products</strong>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">Sort: <select className="chip bg-surface-container-high font-bold" value={sortFilter} onChange={(e) => { setSortFilter(e.target.value); setPage(1) }}>{SORT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select></div>
                <div className="flex bg-surface-container-high rounded-lg p-1">
                  <button className="px-2.5 py-1 rounded-md bg-surface-container-lowest shadow-soft"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>grid_view</span></button>
                  <button className="px-2.5 py-1 text-on-surface-variant"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>view_list</span></button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {(categoryFilter || tasteFilter || spaceFilter || colorFilter || materialFilter || minPrice > 0 || maxPrice < 50000) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {categoryFilter && (
                  <button className="chip bg-primary-fixed text-primary flex items-center gap-1" onClick={() => { setCategoryFilter(''); setPage(1) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>{categoryFilter}
                  </button>
                )}
                {tasteFilter && (
                  <button className="chip bg-primary-fixed text-primary flex items-center gap-1" onClick={() => { setTasteFilter(''); setPage(1) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>{tasteFilter}
                  </button>
                )}
                {spaceFilter && (
                  <button className="chip bg-primary-fixed text-primary flex items-center gap-1" onClick={() => { setSpaceFilter(''); setPage(1) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>{spaceFilter}
                  </button>
                )}
                {colorFilter && (
                  <button className="chip bg-primary-fixed text-primary flex items-center gap-1" onClick={() => { setColorFilter(''); setPage(1) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>{colorFilter}
                  </button>
                )}
                {materialFilter && (
                  <button className="chip bg-primary-fixed text-primary flex items-center gap-1" onClick={() => { setMaterialFilter(''); setPage(1) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>{materialFilter}
                  </button>
                )}
                {(minPrice > 0 || maxPrice < 50000) && (
                  <button className="chip bg-primary-fixed text-primary flex items-center gap-1" onClick={() => { setMinPrice(0); setMaxPrice(50000); setPage(1) }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>{minPrice.toLocaleString()}–{maxPrice.toLocaleString()} MAD
                  </button>
                )}
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="grid grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient animate-pulse">
                    <div className="aspect-square bg-surface-container-high"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-surface-container-high rounded w-2/3"></div>
                      <div className="h-4 bg-surface-container-high rounded w-4/5"></div>
                      <div className="h-4 bg-surface-container-high rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>error</span>
                <p className="mt-4 text-on-surface-variant">Failed to load products. {(error as Error)?.message}</p>
              </div>
            )}

            {/* Cards */}
            {!isLoading && !isError && (
              <>
                <div className="grid grid-cols-3 gap-5">
                  {products.map((product: Product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient hover:-translate-y-0.5 transition group"
                    >
                      <div className="aspect-square relative bg-surface-container-high">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt_text || product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container-high"></div>
                        )}
                        {product.is_featured && (
                          <span className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2">Best seller</span>
                        )}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black/40 grid place-items-center">
                            <span className="chip bg-white text-on-surface uppercase tracking-widest-2 font-black">Out of stock</span>
                          </div>
                        )}
                        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 grid place-items-center opacity-0 group-hover:opacity-100 transition" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!authStore.isAuth) return; toggleWishlist.mutate(product.id) }}><span className={`material-symbols-outlined${wishlistStore.isWishlisted(product.id) ? ' ms-fill text-primary' : ''}`} style={{ fontSize: 18 }}>favorite</span></button>
                      </div>
                      <div className={`p-4${product.stock === 0 ? ' opacity-60' : ''}`}>
                        <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">{product.category?.name ?? 'Product'}</div>
                        <div className="font-bold mt-1">{product.name}</div>
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {product.variants.map((v) => (
                              v.color_hex && <span key={v.id} className="w-3 h-3 rounded-full border border-white shadow" style={{ backgroundColor: v.color_hex }}></span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className={`font-black ${product.stock === 0 ? 'text-on-surface-variant' : 'text-primary'}`}>{formatPrice(product.price)}</span>
                          {product.avg_rating > 0 && (
                            <span className="text-xs text-on-surface-variant">★ {product.avg_rating.toFixed(1)} ({product.review_count})</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>search_off</span>
                    <p className="mt-4 text-on-surface-variant">No products found matching your criteria.</p>
                  </div>
                )}

                {/* Editorial banner mid-grid */}
                <div className="my-8 bg-[#1c1b1b] text-white rounded-xl p-8 flex items-center gap-8">
                  <svg className="flex-shrink-0 opacity-90" width="80" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" stroke="#ba0a0d" strokeWidth="1"/><rect x="35" y="20" width="30" height="60" fill="#ba0a0d"/></svg>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-widest-2 text-primary font-bold mb-1">Style spotlight</div>
                    <h3 className="h-display text-3xl">Kendo · 20% off through Ramadan</h3>
                    <p className="text-white/60 mt-1">All 24 Kendo pieces — black-on-black with a single red accent. Auto-applied at checkout.</p>
                  </div>
                  <Link to="/styles" className="btn-grad text-white font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-widest-2 whitespace-nowrap">Shop Kendo →</Link>
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      className="w-9 h-9 grid place-items-center rounded-lg hover:bg-surface-container-high"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
                    </button>
                    {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`w-9 h-9 grid place-items-center rounded-lg ${p === page ? 'btn-grad text-white font-bold' : 'hover:bg-surface-container-high font-semibold'}`}
                        onClick={() => setPage(p)}
                      >{p}</button>
                    ))}
                    {lastPage > 5 && (
                      <>
                        <span className="px-1 text-on-surface-variant">…</span>
                        <button
                          className={`w-9 h-9 grid place-items-center rounded-lg ${page === lastPage ? 'btn-grad text-white font-bold' : 'hover:bg-surface-container-high font-semibold'}`}
                          onClick={() => setPage(lastPage)}
                        >{lastPage}</button>
                      </>
                    )}
                    <button
                      className="w-9 h-9 grid place-items-center rounded-lg hover:bg-surface-container-high"
                      disabled={page >= lastPage}
                      onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
