import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '../api'
import type { CheckoutPayload, Order } from '../types'

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersApi.list().then((r) => r.data),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.show(id).then((r) => ((r.data as any)?.data ?? r.data) as Order),
    enabled: !!id,
  })
}

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => ordersApi.checkout(payload).then((r) => ((r.data as any)?.data ?? r.data) as Order),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-orders'] })
    },
  })
}
