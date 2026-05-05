// frontend/src/hooks/index.ts
// All React Query hooks for Desk+
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, catalogApi, cartApi, ordersApi, adminApi } from '../api';
import type { ProductFilters } from '../types';

// ── Catalog ──────────────────────────────────────────────────
export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: () => catalogApi.categories().then(r => r.data), staleTime: 1000 * 60 * 10 });

export const useSpaces = (featured?: boolean) =>
  useQuery({ queryKey: ['spaces', featured], queryFn: () => catalogApi.spaces(featured).then(r => r.data), staleTime: 1000 * 60 * 10 });

export const useSpace = (slug: string) =>
  useQuery({ queryKey: ['space', slug], queryFn: () => catalogApi.showSpace(slug).then(r => r.data), enabled: !!slug });

export const useTastes = () =>
  useQuery({ queryKey: ['tastes'], queryFn: () => catalogApi.tastes().then(r => r.data), staleTime: 1000 * 60 * 10 });

// ── Products ─────────────────────────────────────────────────
export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn:  () => productsApi.list(filters).then(r => r.data),
    staleTime: 1000 * 60 * 2,
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn:  () => productsApi.show(slug).then(r => r.data),
    enabled:  !!slug,
  });

export const useFeaturedProducts = () =>
  useQuery({ queryKey: ['products', 'featured'], queryFn: () => productsApi.featured().then(r => r.data), staleTime: 1000 * 60 * 5 });

export const useNewArrivals = () =>
  useQuery({ queryKey: ['products', 'new-arrivals'], queryFn: () => productsApi.newArrivals().then(r => r.data), staleTime: 1000 * 60 * 5 });

// ── Cart ─────────────────────────────────────────────────────
export const useCart = () =>
  useQuery({ queryKey: ['cart'], queryFn: () => cartApi.get().then(r => r.data), staleTime: 0 });

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId, quantity }: { productId: number; variantId?: number; quantity?: number }) =>
      cartApi.addItem(productId, variantId, quantity),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
};

// ── Orders ───────────────────────────────────────────────────
export const useOrders = () =>
  useQuery({ queryKey: ['orders'], queryFn: () => ordersApi.list().then(r => r.data) });

export const useOrder = (id: number) =>
  useQuery({ queryKey: ['order', id], queryFn: () => ordersApi.show(id).then(r => r.data), enabled: !!id });

export const useCheckout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.checkout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// ── Admin ────────────────────────────────────────────────────
export const useAdminStats = () =>
  useQuery({ queryKey: ['admin', 'stats'], queryFn: () => adminApi.stats().then(r => r.data), staleTime: 1000 * 60 * 5 });

export const useAdminOrders = (params?: object) =>
  useQuery({ queryKey: ['admin', 'orders', params], queryFn: () => adminApi.orders(params).then(r => r.data) });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: string; note?: string }) =>
      adminApi.updateOrderStatus(id, status, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });
};

export const useAdminUsers = (params?: object) =>
  useQuery({ queryKey: ['admin', 'users', params], queryFn: () => adminApi.users(params).then(r => r.data) });

export const useAdminProducts = (params?: object) =>
  useQuery({ queryKey: ['admin', 'products', params], queryFn: () => adminApi.products(params).then(r => r.data) });

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
};

export const useAdminDiscounts = (params?: object) =>
  useQuery({ queryKey: ['admin', 'discounts', params], queryFn: () => adminApi.discounts(params).then(r => r.data) });

export const useAdminReviews = (params?: object) =>
  useQuery({ queryKey: ['admin', 'reviews', params], queryFn: () => adminApi.reviews(params).then(r => r.data) });
