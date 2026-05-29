import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export function useSellerOrders(params?: object) {
  return useQuery({
    queryKey: ['seller', 'orders', params],
    queryFn: () => sellerApi.orders(params).then((r) => r.data),
  })
}

export function useUpdateSellerOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: string; note?: string }) =>
      sellerApi.updateOrderStatus(id, status, note).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seller', 'orders'] })
      qc.invalidateQueries({ queryKey: ['seller', 'stats'] })
    },
  })
}
