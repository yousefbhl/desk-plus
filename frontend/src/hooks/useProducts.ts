import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api'
import type { Product, ProductFilters } from '../types'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.list(filters).then((r) => r.data),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.show(slug).then((r) => ((r.data as any)?.data ?? r.data) as Product),
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.featured(),
  })
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productsApi.newArrivals(),
  })
}
