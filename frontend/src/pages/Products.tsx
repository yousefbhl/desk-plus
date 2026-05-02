import { useState } from 'react'
import FilterSidebar from '../components/ui/FilterSidebar'
import ProductCard from '../components/ui/ProductCard'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types/types'

export default function Products() {
  const [filters, setFilters] = useState<Record<string, unknown>>({})
  const { data, isLoading } = useProducts(filters)

  const products: Product[] = data?.data ?? data ?? []

  return (
    <section>
      <h1>Products</h1>
      <FilterSidebar onFilterChange={(next) => setFilters(next)} />
      {isLoading && <p>Loading products...</p>}
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
