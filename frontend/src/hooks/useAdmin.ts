import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats().then((r) => ((r.data as any)?.data ?? r.data) as Record<string, any>),
  })
}

export function useAdminProducts(params?: object) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminApi.products(params).then((r) => r.data),
  })
}

export function useAdminOrders(params?: object) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => adminApi.orders(params).then((r) => r.data),
  })
}

export function useAdminUsers(params?: object) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.users(params).then((r) => r.data),
  })
}

export function useAdminSellers(params?: object) {
  return useQuery({
    queryKey: ['admin', 'users', 'sellers', params],
    queryFn: () => adminApi.users({ ...params as Record<string, unknown>, role: 'seller' }).then((r) => r.data),
  })
}

export function useAdminDiscounts(params?: object) {
  return useQuery({
    queryKey: ['admin', 'discounts', params],
    queryFn: () => adminApi.discounts(params).then((r) => r.data),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: string; note?: string }) =>
      adminApi.updateOrderStatus(id, status, note).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })
}

export function useApproveSeller() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      adminApi.updateUserRole(id, role).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}
