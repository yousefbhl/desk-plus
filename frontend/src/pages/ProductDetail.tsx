import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCartStore } from '../store/cartStore'
import { useUiStore } from '../store/uiStore'
import { useWishlistStore } from '../store/wishlistStore'
import { useToggleWishlist } from '../hooks/useWishlist'
import { useAuthStore } from '../store/authStore'

function formatPrice(price: number): string {
  return price.toLocaleString('fr-MA') + ' MAD'
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isLoading, isError } = useProduct(slug!)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useUiStore((s) => s.openCart)
  const showToast = useUiStore((s) => s.showToast)
  const [qty, setQty] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('description')
  const navigate = useNavigate()
  const wishlistStore = useWishlistStore()
  const toggleWishlist = useToggleWishlist()
  const authStore = useAuthStore()

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-20 text-center">
        <div className="animate-spin inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="mt-4 text-on-surface-variant">Loading product...</p>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="max-w-screen-2xl mx-auto px-8 py-20 text-center">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 48 }}>error</span>
        <p className="mt-4 text-on-surface-variant">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-primary font-semibold">Back to products</Link>
      </div>
    )
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const primaryImage = product.images?.[0]?.url
  const galleryImages = product.images ?? []

  const handleAddToCart = () => {
    addItem(product, qty)
    openCart()
    showToast('Added to cart')
  }

  return (
    <div>
      {/* BREADCRUMB */}
      <div className="bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8 py-3 text-sm text-on-surface-variant flex items-center gap-2">
          <Link to="/" className="hover:text-on-surface">Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          <Link to="/products" className="hover:text-on-surface">Products</Link>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          {product.category && (
            <>
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-on-surface">{product.category.name}</Link>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            </>
          )}
          <span className="text-on-surface font-semibold">{product.name}</span>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-10">
          {/* Gallery */}
          <div className="col-span-7">
            <div className="relative rounded-xl overflow-hidden aspect-square bg-surface-container-high">
              {galleryImages[selectedImage]?.url ? (
                <img src={galleryImages[selectedImage].url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-container-high"></div>
              )}
              {product.is_featured && (
                <span className="absolute top-4 left-4 chip bg-primary text-white uppercase tracking-widest-2">Best Seller</span>
              )}
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 grid place-items-center shadow-ambient" onClick={() => authStore.isAuth ? toggleWishlist.mutate(product.id) : navigate('/login')}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{wishlistStore.isWishlisted(product.id) ? 'favorite' : 'favorite_border'}</span>
              </button>
              <button className="absolute bottom-4 right-4 chip bg-white/90 text-on-surface backdrop-blur">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>zoom_in</span> Hover to zoom
              </button>
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {galleryImages.slice(0, 4).map((img, i) => (
                  <div key={img.id} className={`aspect-square rounded-lg overflow-hidden ${i === selectedImage ? 'ring-2 ring-primary' : 'opacity-90'}`} onClick={() => setSelectedImage(i)}>
                    <img src={img.url} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="col-span-5">
            {product.category && (
              <span className="chip bg-surface-container-high">{product.category.name}</span>
            )}
            <h1 className="h-display text-4xl mt-4 leading-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              {product.avg_rating > 0 && (
                <>
                  <div className="flex items-center text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined ms-fill" style={{ fontSize: 18 }}>
                        {i < Math.floor(product.avg_rating) ? 'star' : i < product.avg_rating ? 'star_half' : 'star'}
                      </span>
                    ))}
                  </div>
                  <span className="font-bold">{product.avg_rating.toFixed(1)}</span>
                  <span className="text-on-surface-variant">{product.review_count} reviews</span>
                  <span className="text-on-surface-variant">·</span>
                </>
              )}
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>In stock</span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>cancel</span>Out of stock</span>
              )}
            </div>

            <div className="mt-6 flex items-end gap-4">
              <div className="text-5xl font-black text-primary tracking-tight">{formatPrice(product.price).replace(' MAD', '')} <span className="text-xl">MAD</span></div>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <div className="pb-2 line-through text-on-surface-variant text-lg">{formatPrice(product.compare_price)}</div>
                  <span className="chip bg-primary-fixed text-primary mb-2">Save {discount}%</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="mt-5 text-on-surface-variant leading-relaxed">{product.description}</p>
            )}

            {/* Variants */}
            {product.variants && product.variants.some(v => v.color_hex) && (
              <div className="mt-7">
                <div className="text-xs font-bold tracking-widest-2 uppercase mb-3">Color</div>
                <div className="flex gap-3">
                  {product.variants.filter(v => v.color_hex).map((v) => (
                    <button key={v.id} className={`w-9 h-9 rounded-full ${selectedColor === v.color_hex ? 'ring-2 ring-primary ring-offset-2' : ''}`} style={{ backgroundColor: v.color_hex ?? undefined }} onClick={() => setSelectedColor(v.color_hex ?? null)}></button>
                  ))}
                </div>
              </div>
            )}

            {product.variants && product.variants.some(v => v.material) && (
              <div className="mt-6">
                <div className="text-xs font-bold tracking-widest-2 uppercase mb-3">Material</div>
                <div className="flex gap-2">
                  {product.variants.filter(v => v.material).map((v) => (
                    <button key={v.id} className={`chip ${selectedMaterial === v.material ? 'btn-grad' : 'bg-surface-container-high'}`} onClick={() => setSelectedMaterial(v.material ?? null)}>{v.material}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center bg-surface-container-high rounded-xl h-12">
                <button className="w-12 h-12 grid place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))}><span className="material-symbols-outlined">remove</span></button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button className="w-12 h-12 grid place-items-center" onClick={() => setQty((q) => q + 1)}><span className="material-symbols-outlined">add</span></button>
              </div>
              <button
                className="flex-1 btn-grad text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest-2 text-sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <span className="material-symbols-outlined">shopping_bag</span> Add to Cart
              </button>
            </div>
            <button className="mt-3 w-full border border-outline-variant text-on-surface font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container" onClick={() => authStore.isAuth ? toggleWishlist.mutate(product.id) : navigate('/login')}>
              <span className="material-symbols-outlined">{wishlistStore.isWishlisted(product.id) ? 'favorite' : 'favorite_border'}</span> {wishlistStore.isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Trust */}
            <div className="mt-7 grid grid-cols-3 gap-3 text-xs">
              <div className="flex flex-col items-center gap-1 bg-surface-container-low rounded-xl py-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <span className="font-semibold">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-surface-container-low rounded-xl py-3">
                <span className="material-symbols-outlined text-primary">verified</span>
                <span className="font-semibold">2-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-surface-container-low rounded-xl py-3">
                <span className="material-symbols-outlined text-primary">restart_alt</span>
                <span className="font-semibold">30-Day Returns</span>
              </div>
            </div>

            {/* Seller */}
            <div className="mt-6 bg-surface-container-low rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full btn-grad grid place-items-center text-white font-bold text-sm">
                {product.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-xs text-on-surface-variant">Sold by</div>
                <div className="font-bold flex items-center gap-2">Desk+ <span className="material-symbols-outlined ms-fill text-primary" style={{ fontSize: 16 }}>verified</span></div>
              </div>
              <Link to="/products" className="text-sm text-primary font-semibold">View store →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="max-w-screen-2xl mx-auto px-8 pb-12">
        <div className="border-b border-outline-variant flex items-center gap-10 text-sm">
          <button className={`py-4 ${activeTab === 'description' ? 'red-underline font-bold' : 'font-semibold text-on-surface-variant hover:text-on-surface'}`} onClick={() => setActiveTab('description')}>Description</button>
          <button className={`py-4 ${activeTab === 'specifications' ? 'red-underline font-bold' : 'font-semibold text-on-surface-variant hover:text-on-surface'}`} onClick={() => setActiveTab('specifications')}>Specifications</button>
          <button className={`py-4 ${activeTab === 'reviews' ? 'red-underline font-bold' : 'font-semibold text-on-surface-variant hover:text-on-surface'}`} onClick={() => setActiveTab('reviews')}>Reviews ({product.review_count})</button>
          <button className={`py-4 ${activeTab === 'delivery' ? 'red-underline font-bold' : 'font-semibold text-on-surface-variant hover:text-on-surface'}`} onClick={() => setActiveTab('delivery')}>Delivery</button>
        </div>
        {activeTab === 'description' && (
        <div className="grid grid-cols-2 gap-12 py-10">
          <div>
            {product.description ? (
              <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
            ) : (
              <p className="text-on-surface-variant leading-relaxed">No description available.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">airline_seat_recline_extra</span>
              <div className="font-bold mt-2">Ergonomic</div>
              <div className="text-xs text-on-surface-variant">Designed for comfort</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">tune</span>
              <div className="font-bold mt-2">Adjustable</div>
              <div className="text-xs text-on-surface-variant">Customizable settings</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">air</span>
              <div className="font-bold mt-2">Breathable</div>
              <div className="text-xs text-on-surface-variant">Premium materials</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">recycling</span>
              <div className="font-bold mt-2">Sustainable</div>
              <div className="text-xs text-on-surface-variant">Eco-friendly build</div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'specifications' && (
        <>
        {/* Specs */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-surface-container-low rounded-xl p-2">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map((spec, i) => (
                  <tr key={spec.key} className={i % 2 === 0 ? 'bg-surface-container-lowest' : ''}>
                    <td className="py-3 px-5 font-semibold w-1/3">{spec.key}</td>
                    <td className="py-3 px-5 text-on-surface-variant">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {(!product.specifications || product.specifications.length === 0) && (
          <div className="bg-surface-container-low rounded-xl p-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="bg-surface-container-lowest"><td className="py-3 px-5 font-semibold w-1/3">Category</td><td className="py-3 px-5 text-on-surface-variant">{product.category?.name ?? 'N/A'}</td></tr>
                <tr><td className="py-3 px-5 font-semibold">SKU</td><td className="py-3 px-5 text-on-surface-variant">{product.sku ?? 'N/A'}</td></tr>
                <tr className="bg-surface-container-lowest"><td className="py-3 px-5 font-semibold">Stock</td><td className="py-3 px-5 text-on-surface-variant">{product.stock} units</td></tr>
              </tbody>
            </table>
          </div>
        )}
        </>
        )}

        {activeTab === 'reviews' && (
        <div className="py-10">
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review: any, i: number) => (
                <div key={i} className="bg-surface-container-low rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-bold">{review.user?.name ?? 'Anonymous'}</div>
                    <div className="flex items-center text-primary">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className="material-symbols-outlined ms-fill" style={{ fontSize: 16 }}>
                          {j < review.rating ? 'star' : 'star'}
                        </span>
                      ))}
                    </div>
                    {review.created_at && <span className="text-xs text-on-surface-variant">{new Date(review.created_at).toLocaleDateString()}</span>}
                  </div>
                  <p className="text-on-surface-variant text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant">No reviews yet. Be the first to review this product.</p>
          )}
        </div>
        )}

        {activeTab === 'delivery' && (
        <div className="py-10">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <div className="font-bold mt-2">Free Delivery</div>
              <div className="text-xs text-on-surface-variant">Free shipping on all orders over 500 MAD. Standard delivery takes 3-5 business days.</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">restart_alt</span>
              <div className="font-bold mt-2">30-Day Returns</div>
              <div className="text-xs text-on-surface-variant">Not satisfied? Return within 30 days for a full refund. Items must be in original condition.</div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-5">
              <span className="material-symbols-outlined text-primary">verified</span>
              <div className="font-bold mt-2">2-Year Warranty</div>
              <div className="text-xs text-on-surface-variant">All products come with a 2-year manufacturer warranty covering defects.</div>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* Reviews section - static placeholder */}
      <section className="bg-surface-container-low">
        <div className="max-w-screen-2xl mx-auto px-8 py-16">
          <h2 className="h-display text-2xl mb-8">What customers say</h2>
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-4">
              <div className="text-7xl font-black text-primary">{product.avg_rating.toFixed(1)}</div>
              <div className="flex items-center text-primary mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined ms-fill">
                    {i < Math.floor(product.avg_rating) ? 'star' : i < product.avg_rating ? 'star_half' : 'star'}
                  </span>
                ))}
              </div>
              <div className="text-sm text-on-surface-variant mt-2">Based on {product.review_count} verified reviews</div>
            </div>
            <div className="col-span-8">
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.slice(0, 3).map((review: any, i: number) => (
                    <div key={i} className="bg-surface-container-lowest rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold">{review.user?.name ?? 'Anonymous'}</div>
                        <div className="flex items-center text-primary">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <span key={j} className="material-symbols-outlined ms-fill" style={{ fontSize: 16 }}>
                              {j < review.rating ? 'star' : 'star'}
                            </span>
                          ))}
                        </div>
                        {review.created_at && <span className="text-xs text-on-surface-variant">{new Date(review.created_at).toLocaleDateString()}</span>}
                      </div>
                      <p className="text-on-surface-variant text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant">No reviews yet. Be the first to review this product.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related - kept static as placeholder */}
      <section className="max-w-screen-2xl mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="h-display text-2xl">You might also like</h2>
          <Link to="/products" className="text-sm font-semibold text-primary">View all products →</Link>
        </div>
      </section>
    </div>
  )
}
