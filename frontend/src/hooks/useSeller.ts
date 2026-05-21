import { useQuery } from '@tanstack/react-query'
import { sellerApi } from '../api'

export function useSellerStats() {
  return useQuery({
    queryKey: ['seller', 'stats'],
    queryFn: () => sellerApi.stats().then((r) => ((r.data as any)?.data ?? r.data) as Record<string, any>),
  })
}

export function useSellerProducts(params?: object) {
  return useQuery({
    queryKey: ['seller', 'products', params],
    queryFn: () => sellerApi.products(params).then((r) => r.data),
  })
}
