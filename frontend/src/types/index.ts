// ============================================================
// frontend/src/types/index.ts
// All TypeScript interfaces for Desk+
// ============================================================

// ── Auth & Users ─────────────────────────────────────────────
export type UserRole = 'admin' | 'seller' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  phone: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ── Catalog ───────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  children?: Pick<Category, 'id' | 'name' | 'slug'>[];
}

export interface Space {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  layout_type: 'u-shape' | 'l-shape' | 'plus-shape' | 'call-center' | 'open' | 'other' | null;
  total_price: number | null;
  is_featured: boolean;
  products?: SpaceProduct[];
}

export interface SpaceProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  category: string;
}

export interface Taste {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color_hex: string | null;
}

// ── Products ──────────────────────────────────────────────────
export interface ProductImage {
  id: number;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: number;
  color: string | null;
  color_hex: string | null;
  material: string | null;
  price_modifier: number;
  stock: number;
  sku_suffix: string | null;
}

export interface ProductSpecification {
  key: string;
  value: string;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  sku: string | null;
  stock: number;
  in_stock: boolean;
  is_featured: boolean;
  is_active: boolean;
  avg_rating: number;
  review_count: number;
  category: Pick<Category, 'id' | 'name' | 'slug'> | null;
  space: Pick<Space, 'id' | 'name' | 'slug'> | null;
  taste: Pick<Taste, 'id' | 'name' | 'slug' | 'color_hex'> | null;
  seller?: Pick<User, 'id' | 'name'>;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications?: ProductSpecification[];
  created_at: string;
  updated_at: string;
}

// ── Product filters (for catalog page) ───────────────────────
export interface ProductFilters {
  category_id?: number;
  space_id?: number;
  taste_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  is_featured?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'popular' | 'newest';
  page?: number;
  per_page?: number;
}

// ── Cart ──────────────────────────────────────────────────────
export interface CartVariant {
  id: number;
  color: string | null;
  color_hex: string | null;
  material: string | null;
  price_modifier: number;
  stock: number;
}

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  stock: number;
  image: string | null;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: CartProduct;
  variant: CartVariant | null;
  line_total: number;
}

export interface CartDiscount {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

export interface Cart {
  cart_id: number;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  discount: CartDiscount | null;
  shipping_cost: number;
  total: number;
}

// ── Orders ────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'cash' | 'bank_transfer';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  variant_info: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  country: string;
  postal_code: string | null;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  reference: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  notes: string | null;
  user: Pick<User, 'id' | 'name' | 'email'> | null;
  items: OrderItem[];
  shipping_address: ShippingAddress | null;
  status_history?: OrderStatusHistory[];
  created_at: string;
  updated_at: string;
}

// Checkout form payload
export interface CheckoutPayload {
  shipping: ShippingAddress;
  payment_method: PaymentMethod;
  coupon_code?: string;
  notes?: string;
}

// ── Discounts ─────────────────────────────────────────────────
export interface Discount {
  id: number;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  per_user_limit: number | null;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

// ── Admin Dashboard ───────────────────────────────────────────
export interface AdminStats {
  overview: {
    total_users: number;
    total_sellers: number;
    total_revenue: number;
    total_orders: number;
    pending_orders: number;
    avg_order: number;
  };
  best_seller: {
    product_id: number;
    product_name: string;
    units_sold: number;
  } | null;
  best_category: {
    name: string;
    units_sold: number;
  } | null;
  monthly_revenue: {
    month: number;
    year: number;
    revenue: number;
    orders: number;
  }[];
  orders_by_status: Record<OrderStatus, number>;
  top_products: {
    product_id: number;
    product_name: string;
    units_sold: number;
    revenue: number;
  }[];
  seller_rankings: {
    id: number;
    name: string;
    avatar: string | null;
    products_count: number;
    revenue: number;
  }[];
}

// ── Pagination ────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// ── Reviews ───────────────────────────────────────────────────
export interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  created_at: string;
}
