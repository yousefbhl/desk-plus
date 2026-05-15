import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api'
import { useCartStore } from '../store/cartStore'
import { useToastStore } from '../store/toastStore'
import { Skeleton } from '../components/ui/Skeleton'
import type { ProductVariant } from '../types'

const TABS = ['Description', 'Specifications', 'Reviews', 'Delivery']

export default function ProductDetail() {
  const { slug }  = useParams<{ slug: string }>()
  const [activeImg, setActiveImg]     = useState(0)
  const [qty, setQty]                 = useState(1)
  const [activeTab, setActiveTab]     = useState('Description')
  const [selectedVariant, setVariant] = useState<ProductVariant | null>(null)
  const [adding, setAdding]           = useState(false)

  const { addItem } = useCartStore()
  const { show }    = useToastStore()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.show(slug!).then((r) => r.data),
    enabled: !!slug,
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews', slug],
    queryFn: () => productsApi.reviews?.(slug!).then((r) => r.data) ?? Promise.resolve([]),
    enabled: !!slug && activeTab === 'Reviews',
  })

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    try {
      await addItem(product.id, selectedVariant?.id, qty)
      show('Added to cart!', 'success')
    } catch {
      show('Please sign in to add to cart', 'error')
    } finally {
      setAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-7"><Skeleton className="aspect-square rounded-xl" /></div>
          <div className="col-span-5 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images    = product.images ?? []
  const variants  = product.variants ?? []
  const specs     = product.specifications ?? []
  const colors    = [...new Map(variants.filter((v) => v.color).map((v) => [v.color, v])).values()]
  const materials = [...new Set(variants.filter((v) => v.material).map((v) => v.material!))]
  const activePrice = product.price + (selectedVariant?.price_modifier ?? 0)
  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : null

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-surface-container-low border-b border-outline-variant/40">
        <div className="max-w-screen-2xl mx-auto px-8 py-3 text-sm text-on-surface-variant flex items-center gap-2">
          <Link to="/" className="hover:text-on-surface">Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          <Link to="/products" className="hover:text-on-surface">Products</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          {product.category && <><span>{product.category.name}</span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span></>}
          <span className="text-on-surface font-semibold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-10">

          {/* Gallery */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative rounded-xl overflow-hidden aspect-square bg-surface-container">
              {images[activeImg]?.url ? (
                <img src={images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full ph-mesh-chair" />
              )}
              {discount && (
                <span className="absolute top-4 left-4 chip bg-primary text-white uppercase" style={{ fontSize: 10 }}>-{discount}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary' : 'border-transparent hover:border-outline'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="col-span-12 lg:col-span-5 space-y-5">
            {product.category && (
              <span className="chip bg-surface-container-high text-on-surface-variant">{product.category.name}</span>
            )}
            <h1 className="h-display text-4xl leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.avg_rating > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-primary">
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} className="material-symbols-outlined ms-fill" style={{ fontSize: 16 }}>
                      {n <= product.avg_rating ? 'star' : 'star_border'}
                    </span>
                  ))}
                </div>
                <span className="font-bold">{product.avg_rating.toFixed(1)}</span>
                <span className="text-on-surface-variant">({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="h-display text-4xl text-primary">{activePrice.toLocaleString()} MAD</span>
              {product.compare_price && (
                <span className="text-on-surface-variant text-lg line-through">{product.compare_price.toLocaleString()}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-on-surface-variant leading-relaxed text-sm">{product.description}</p>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest-2 mb-2.5">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariant(selectedVariant?.id === v.id ? null : v)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${selectedVariant?.id === v.id ? 'ring-active' : 'border-outline-variant hover:border-outline'}`}
                      style={{ background: v.color_hex ?? '#ccc' }}
                      title={v.color ?? ''}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {materials.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest-2 mb-2.5">Material</p>
                <div className="flex gap-2 flex-wrap">
                  {materials.map((m) => {
                    const v = variants.find((vv) => vv.material === m)!
                    return (
                      <button
                        key={m}
                        onClick={() => setVariant(selectedVariant?.material === m ? null : v)}
                        className={`chip border-2 transition-all ${selectedVariant?.material === m ? 'bg-primary text-white border-primary' : 'border-outline-variant hover:border-outline'}`}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-widest-2">Qty</p>
              <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 grid place-items-center hover:bg-surface-container-high text-lg">−</button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 grid place-items-center hover:bg-surface-container-high text-lg">+</button>
              </div>
              <span className={`text-xs ${product.stock > 10 ? 'text-green-700' : product.stock > 0 ? 'text-amber-600' : 'text-primary'}`}>
                {product.stock > 10 ? `${product.stock} in stock` : product.stock > 0 ? `Only ${product.stock} left` : 'Out of stock'}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="btn-grad py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {adding ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>add_shopping_cart</span>Add to Cart</>
                )}
              </button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[['local_shipping', 'Free Delivery'], ['verified', '2-Year Warranty'], ['restart_alt', '30-Day Returns']].map(([icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>{icon}</span>
                  <span className="text-xs text-on-surface-variant font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="mt-16">
          <div className="flex border-b border-outline-variant overflow-x-auto scrollx">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${activeTab === t ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'Description' && (
              <p className="text-on-surface-variant leading-relaxed max-w-3xl">{product.description ?? 'No description available.'}</p>
            )}

            {activeTab === 'Specifications' && (
              <div className="max-w-2xl">
                {specs.length === 0 ? (
                  <p className="text-on-surface-variant">No specifications available.</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-surface-container-low' : ''}>
                          <td className="py-3 px-4 font-semibold w-1/3">{s.key}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div>
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-center">
                    <p className="h-display text-6xl text-primary">{product.avg_rating.toFixed(1)}</p>
                    <div className="flex justify-center text-primary mt-1">
                      {[1,2,3,4,5].map((n) => <span key={n} className="material-symbols-outlined ms-fill" style={{ fontSize: 18 }}>{n <= product.avg_rating ? 'star' : 'star_border'}</span>)}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{product.review_count} reviews</p>
                  </div>
                </div>
                {(reviews as any[] ?? []).map((r: any) => (
                  <div key={r.id} className="border-b border-outline-variant py-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{r.user?.name ?? 'Anonymous'}</p>
                      <p className="text-xs text-on-surface-variant">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex text-primary mb-2">
                      {[1,2,3,4,5].map((n) => <span key={n} className="material-symbols-outlined ms-fill" style={{ fontSize: 14 }}>{n <= r.rating ? 'star' : 'star_border'}</span>)}
                    </div>
                    <p className="text-sm text-on-surface-variant">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Delivery' && (
              <div className="max-w-lg space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <p><strong className="text-on-surface">Standard Delivery:</strong> 3–5 business days — Free on orders above 5,000 MAD</p>
                <p><strong className="text-on-surface">Express Delivery:</strong> 1–2 business days — 150 MAD</p>
                <p><strong className="text-on-surface">Large Items:</strong> Office furniture requires scheduled delivery. Our team will contact you to arrange a suitable time.</p>
                <p><strong className="text-on-surface">Returns:</strong> 30-day hassle-free returns on all unused items in original packaging.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
