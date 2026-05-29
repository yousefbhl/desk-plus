// frontend/src/api/index.ts
import api from './api';
import type {
  AppSettings, AuthResponse, Cart, CheckoutPayload, Discount,
  PaginatedResponse, Product, ProductFilters, Order, SellerOrder, User,
} from '../types';

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
  login:    (email: string, password: string) =>
    api.post<AuthResponse>('/login', { email, password }),

  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
    api.post<AuthResponse>('/register', data),

  me:       () => api.get<User>('/me'),
  logout:   () => api.post('/logout'),
};

// ── Products ─────────────────────────────────────────────────
export const productsApi = {
  list:        (filters: ProductFilters = {}) =>
    api.get<PaginatedResponse<Product>>('/products', { params: filters }),

  show:        (slug: string) =>
    api.get<Product>(`/products/${slug}`),

  featured: () =>
  api.get<any>('/products/featured').then(r =>
    (Array.isArray(r.data) ? r.data : r.data.data) as Product[]
  ),

  newArrivals: () =>
  api.get<any>('/products/new-arrivals').then(r =>
    (Array.isArray(r.data) ? r.data : r.data.data) as Product[]
  ),

  reviews:     (slug: string) =>
    api.get(`/products/${slug}/reviews`),

  addReview:   (slug: string, data: { rating: number; comment?: string }) =>
    api.post(`/products/${slug}/reviews`, data),

  deleteReview: (id: number) =>
    api.delete(`/reviews/${id}`),
};

// ── Catalog ──────────────────────────────────────────────────
export const catalogApi = {
  categories: () => api.get('/categories'),
  spaces:     (featured?: boolean) => api.get('/spaces', { params: featured ? { featured: 1 } : {} }),
  showSpace:  (slug: string) => api.get(`/spaces/${slug}`),
  tastes:     () => api.get('/tastes'),
};

export const settingsApi = {
  get: () => api.get<AppSettings>('/settings'),
};

// ── Cart (server-side, used when authenticated) ─────────────
export const cartApi = {
  get:          () => api.get<Cart>('/cart'),
  addItem:      (product_id: number, variant_id?: number, quantity = 1) =>
    api.post<Cart>('/cart/items', { product_id, variant_id, quantity }),
  updateItem:   (cartItemId: number, quantity: number) =>
    api.patch<Cart>(`/cart/items/${cartItemId}`, { quantity }),
  removeItem:   (cartItemId: number) =>
    api.delete<Cart>(`/cart/items/${cartItemId}`),
  clear:        () => api.delete('/cart'),
  applyCoupon:  (code: string) => api.post<Cart>('/cart/coupon', { code }),
  removeCoupon: () => api.delete<Cart>('/cart/coupon'),
  validateCoupon: (code: string, subtotal: number) =>
    api.post('/discounts/validate', { code, subtotal }),
};

// ── Seller ──────────────────────────────────────────────────
export const sellerApi = {
  stats:    () => api.get('/seller/stats'),
  products: (params?: object) => api.get<PaginatedResponse<Product>>('/seller/products', { params }),
  orders:   (params?: object) => api.get<PaginatedResponse<SellerOrder>>('/seller/orders', { params }),
  updateOrderStatus: (id: number, status: string, note?: string) =>
    api.patch<SellerOrder>(`/seller/orders/${id}/status`, { status, note }),
};

// ── Wishlist ────────────────────────────────────────────────
export const wishlistApi = {
  list:   () => api.get('/me/wishlist'),
  toggle: (productId: number) => api.post(`/me/wishlist/${productId}`),
};

// ── Orders ───────────────────────────────────────────────────
export const ordersApi = {
  list:     () => api.get<PaginatedResponse<Order>>('/orders'),
  show:     (id: number) => api.get<Order>(`/orders/${id}`),
  checkout: (payload: CheckoutPayload) => api.post<Order>('/orders', payload),
};

// ── Admin ────────────────────────────────────────────────────
export const adminApi = {
  stats: () => api.get('/admin/stats'),
  settings: () => api.get<AppSettings>('/admin/settings'),
  updateSettings: (data: Partial<AppSettings>) =>
    api.put<AppSettings>('/admin/settings', data),

  orders: (params?: object) =>
    api.get<PaginatedResponse<Order>>('/admin/orders', { params }),
  updateOrderStatus: (id: number, status: string, note?: string) =>
    api.patch<Order>(`/admin/orders/${id}/status`, { status, note }),

  users: (params?: object) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params }),
  updateUserRole: (id: number, role: string) =>
    api.put<User>(`/admin/users/${id}/role`, { role }),
  deleteUser: (id: number) =>
    api.delete(`/admin/users/${id}`),

  products: (params?: object) =>
    api.get<PaginatedResponse<Product>>('/admin/products', { params }),
  sellers: (params?: object) =>
    api.get<PaginatedResponse<User>>('/admin/sellers', { params }),
  createProduct: (data: object) =>
    api.post<Product>('/admin/products', data),
  updateProduct: (id: number, data: object) =>
    api.put<Product>(`/admin/products/${id}`, data),
  deleteProduct: (id: number) =>
    api.delete(`/admin/products/${id}`),

  discounts: (params?: object) =>
    api.get<PaginatedResponse<Discount>>('/admin/discounts', { params }),
  createDiscount: (data: object) =>
    api.post<Discount>('/admin/discounts', data),
  updateDiscount: (id: number, data: object) =>
    api.put<Discount>(`/admin/discounts/${id}`, data),
  deleteDiscount: (id: number) =>
    api.delete(`/admin/discounts/${id}`),

  reviews: (params?: object) =>
    api.get('/admin/reviews', { params }),
  approveReview: (id: number) =>
    api.patch(`/admin/reviews/${id}/approve`),
  deleteReview: (id: number) =>
    api.delete(`/admin/reviews/${id}`),

  exportReport: (type: string, format: string, from?: string, to?: string) =>
    api.get('/admin/reports/export', {
      params: { type, format, from, to },
      responseType: format === 'csv' ? 'blob' : 'json',
    }),
};
