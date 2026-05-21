import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types'

function formatPrice(price: number): string {
  return price.toLocaleString('fr-MA') + ' MAD'
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const [term, setTerm] = useState(searchParams.get('q') || '')
  const [debouncedTerm, setDebouncedTerm] = useState(term)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(term), 300)
    return () => clearTimeout(timer)
  }, [term])

  const { data, isLoading } = useProducts(
    debouncedTerm.length >= 2 ? { search: debouncedTerm } : {}
  )

  const products: Product[] = debouncedTerm.length >= 2 ? (data?.data ?? []) : []
  const totalResults = debouncedTerm.length >= 2 ? (data?.total ?? 0) : 0

  return (
    <>
      {/* Search header */}
      <section className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-screen-2xl mx-auto px-8 py-6">
          <div className="relative max-w-3xl">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary">search</span>
            <input className="w-full h-[60px] pl-14 pr-12 rounded-xl bg-surface-container-lowest shadow-ambient text-lg font-semibold" value={term} onChange={(e) => setTerm(e.target.value)} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full hover:bg-surface-container-high" onClick={() => setTerm('')}><span className="material-symbols-outlined">close</span></button>
            {/* Autocomplete */}
            <div className="absolute left-0 right-0 top-[68px] bg-surface-container-lowest rounded-xl shadow-ambient p-4 z-20 hidden">
              <div className="text-[10px] font-bold tracking-widest-2 uppercase text-on-surface-variant mb-2">Recent searches</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <button className="chip bg-surface-container-low"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>history</span> standing desk <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span></button>
                <button className="chip bg-surface-container-low"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>history</span> walnut shelves <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span></button>
                <button className="chip bg-surface-container-low"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>history</span> task light black <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span></button>
              </div>
              <div className="text-[10px] font-bold tracking-widest-2 uppercase text-on-surface-variant mb-2">Suggestions</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer">
                  <div className="w-10 h-10 rounded-lg ph-mesh-chair"></div>
                  <div className="flex-1 text-sm"><div className="font-semibold">ErgoFlex Pro <span className="text-primary">chair</span></div><div className="text-xs text-on-surface-variant">Ergonomic Chairs</div></div>
                  <div className="font-bold text-sm">3,490 MAD</div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer">
                  <div className="w-10 h-10 rounded-lg ph-charcoal"></div>
                  <div className="flex-1 text-sm"><div className="font-semibold">Aero Stealth Mesh <span className="text-primary">chair</span></div><div className="text-xs text-on-surface-variant">Ergonomic Chairs</div></div>
                  <div className="font-bold text-sm">2,890 MAD</div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer">
                  <div className="w-10 h-10 rounded-lg ph-cream"></div>
                  <div className="flex-1 text-sm"><div className="font-semibold">Linen Task Plus</div><div className="text-xs text-on-surface-variant">Ergonomic Chairs</div></div>
                  <div className="font-bold text-sm">1,890 MAD</div>
                </div>
              </div>
              <a className="block mt-3 pt-3 border-t border-outline-variant text-center text-sm font-bold text-primary">See all results →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-auto px-8 py-8">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-2xl font-black">Results for <span className="italic font-light">"{debouncedTerm}"</span></div>
            <div className="text-sm text-on-surface-variant mt-1"><strong className="text-on-surface">{totalResults} results</strong> found</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm flex items-center gap-2">Sort by <button className="chip bg-surface-container-high font-bold">Most relevant <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>expand_more</span></button></div>
            <div className="flex bg-surface-container-high rounded-lg p-1">
              <button className="px-2.5 py-1 rounded-md bg-surface-container-lowest shadow-soft"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span></button>
              <button className="px-2.5 py-1 text-on-surface-variant"><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>view_list</span></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 mt-6">
          {/* Filters */}
          <aside className="col-span-3">
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient sticky top-24">
              <div className="text-xs font-bold uppercase tracking-widest-2 mb-5">Refine results</div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Category</div>
                <label className="flex items-center justify-between text-sm mb-2"><span className="flex items-center gap-2"><span className="ck on"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></span> Ergonomic Chairs</span><span className="text-on-surface-variant text-xs">42</span></label>
                <label className="flex items-center justify-between text-sm mb-2"><span className="flex items-center gap-2"><span className="ck"></span> Task Chairs</span><span className="text-on-surface-variant text-xs">18</span></label>
                <label className="flex items-center justify-between text-sm mb-2"><span className="flex items-center gap-2"><span className="ck"></span> Lounge Seating</span><span className="text-on-surface-variant text-xs">7</span></label>
                <label className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><span className="ck"></span> Stools</span><span className="text-on-surface-variant text-xs">5</span></label>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Price range</div>
                <div className="slider-track mb-2"><div className="fill"></div><div className="h" style={{ left: '18%' }}></div><div className="h" style={{ right: '32%' }}></div></div>
                <div className="flex justify-between text-xs text-on-surface-variant"><span>1,200 MAD</span><span>4,800 MAD</span></div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Space</div>
                <label className="flex items-center gap-2 text-sm mb-2"><span className="ck"></span>Dev Space</label>
                <label className="flex items-center gap-2 text-sm mb-2"><span className="ck on"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></span>Wood Modern</label>
                <label className="flex items-center gap-2 text-sm mb-2"><span className="ck"></span>Art Space</label>
                <label className="flex items-center gap-2 text-sm"><span className="ck"></span>Commerce</label>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Style</div>
                <div className="flex flex-wrap gap-2">
                  <button className="chip btn-grad">Kendo</button>
                  <button className="chip bg-surface-container-high">Woody</button>
                  <button className="chip bg-surface-container-high">Hacker</button>
                  <button className="chip bg-surface-container-high">Coco</button>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold mb-3">Color</div>
                <div className="flex gap-2">
                  <button className="w-7 h-7 rounded-full bg-[#1c1b1b] ring-active"></button>
                  <button className="w-7 h-7 rounded-full bg-[#5f5e5e]"></button>
                  <button className="w-7 h-7 rounded-full bg-[#7c4a3a]"></button>
                  <button className="w-7 h-7 rounded-full bg-[#e2dfde] border border-outline-variant"></button>
                  <button className="w-7 h-7 rounded-full bg-[#ba0a0d]"></button>
                </div>
              </div>

              <button className="text-sm font-semibold text-primary" onClick={() => setTerm('')}>× Clear all filters</button>
            </div>
          </aside>

          {/* Results */}
          <div className="col-span-9">
            {/* Loading state */}
            {isLoading && debouncedTerm.length >= 2 && (
              <div className="grid grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
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

            {/* Empty term */}
            {!isLoading && debouncedTerm.length < 2 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>search</span>
                <p className="mt-4 text-on-surface-variant">Start typing to search products.</p>
              </div>
            )}

            {/* No results */}
            {!isLoading && debouncedTerm.length >= 2 && products.length === 0 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>search_off</span>
                <p className="mt-4 text-on-surface-variant">No results found for "{debouncedTerm}".</p>
              </div>
            )}

            {/* Results grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-3 gap-5">
                {products.map((product: Product) => (
                  <Link key={product.id} to={'/products/' + product.slug} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient hover:-translate-y-0.5 transition relative">
                    {product.is_featured && (
                      <span className="absolute top-3 left-3 chip btn-grad uppercase tracking-widest-2 z-10">Best Match</span>
                    )}
                    <div className="aspect-square relative bg-surface-container-high">
                      {product.images?.[0]?.url ? (
                        <img src={product.images[0].url} alt={product.images[0].alt_text || product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high"></div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-on-surface-variant uppercase tracking-widest-2">{product.category?.name ?? 'Product'}</div>
                      <div className="font-bold mt-0.5">{product.name}</div>
                      <div className="flex items-center justify-between mt-3"><span className="font-black text-primary">{formatPrice(product.price)}</span>{product.avg_rating > 0 && <span className="text-xs text-on-surface-variant">★ {product.avg_rating.toFixed(1)}</span>}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
.slider-track{height:6px;background:#e5bdb8;border-radius:3px;position:relative;}
.slider-track .fill{position:absolute;left:18%;right:32%;height:100%;background:#ba0a0d;border-radius:3px;}
.slider-track .h{position:absolute;width:18px;height:18px;border-radius:50%;background:#ba0a0d;top:-6px;box-shadow:0 0 0 4px #fff,0 4px 8px rgba(0,0,0,.1);}
      `}</style>
    </>
  )
}
