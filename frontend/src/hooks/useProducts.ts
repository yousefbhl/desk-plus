import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'

export const useProducts = (filters: Record<string, unknown> = {}) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 60 * 2,
  })
