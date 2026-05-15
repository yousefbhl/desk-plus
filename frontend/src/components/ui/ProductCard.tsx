import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useCartStore } from '../../store/cartStore'
import { useToastStore } from '../../store/toastStore'

const PH_CLASSES = ['ph-warm', 'ph-mesh-chair', 'ph-charcoal', 'ph-wood', 'ph-corp', 'ph-cream', 'ph-walnut']

function getPlaceholder(id: number) {
  return PH_CLASSES[id % PH_CLASSES.length]
}

interface Props {
  product: Product
  badge?: string
}

export default function ProductCard({ product, badge }: Props) {
  const [adding, setAdding] = useState(false)
  const { addItem } = useCartStore()
  const { show } = useToastStore()

  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0]
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await addItem(product.id)
      show('Added to cart', 'success')
    } catch {
      show('Please sign in to add to cart', 'error')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link to={`/products/${product.slug}`} className="group block bg-surface-container-lowest rounded-xl overflow-hidden card-hover shadow-ambient">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text ?? product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full ${getPlaceholder(product.id)}`} />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && (
            <span className="chip bg-primary text-white uppercase tracking-widest-2" style={{ fontSize: 10 }}>{badge}</span>
          )}
          {discount && (
            <span className="chip bg-on-surface text-surface uppercase" style={{ fontSize: 10 }}>-{discount}%</span>
          )}
          {product.stock === 0 && (
            <span className="chip bg-surface-container-high text-on-surface-variant uppercase" style={{ fontSize: 10 }}>Out of Stock</span>
          )}
        </div>

        {/* Hover: Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className="w-full btn-grad py-3 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_shopping_cart</span>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-on-surface-variant uppercase tracking-widest-2 mb-1 truncate">
          {product.category?.name ?? 'Furniture'}
        </p>
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2">{product.name}</h3>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-primary">
              {[1,2,3,4,5].map((n) => (
                <span key={n} className="material-symbols-outlined ms-fill" style={{ fontSize: 14 }}>
                  {n <= Math.floor(product.avg_rating) ? 'star' : n - 0.5 <= product.avg_rating ? 'star_half' : 'star_border'}
                </span>
              ))}
            </div>
            <span className="text-xs text-on-surface-variant">({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-black text-base text-on-surface">{product.price.toLocaleString()} MAD</span>
          {product.compare_price && (
            <span className="text-xs text-on-surface-variant line-through">{product.compare_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
