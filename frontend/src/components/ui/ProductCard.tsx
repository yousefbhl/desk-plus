import type { FC } from 'react'
import useCart from '../../hooks/useCart'
import type { Product } from '../../types/types'

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const addItem = useCart((state) => state.addItem)

  return (
    <article className="card">
      <div className="card-header">
        <strong>{product.name}</strong>
        <span>${product.price.toFixed(2)}</span>
      </div>
      <p>{product.description ?? 'No description'}</p>
      <button onClick={() => addItem(product)} disabled={!product.in_stock}>
        {product.in_stock ? 'Add to cart' : 'Out of stock'}
      </button>
    </article>
  )
}

export default ProductCard
