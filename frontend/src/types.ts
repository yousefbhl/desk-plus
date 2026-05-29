export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'seller' | 'customer' | string
  avatar?: string | null
  phone?: string | null
  roles?: string[]
}

export interface AuthResponse {
  user: User
  token: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
  links?: unknown
  meta?: unknown
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Space {
  id: number
  name: string
  slug: string
  description?: string | null
  image?: string | null
  cover_image?: string | null
  layout_type?: string | null
  is_featured?: boolean
  total_price?: number | null
  products?: Array<{
    id: number
    name: string
    category?: string | null
    price: number
  }>
}

export interface Taste {
  id: number
  name: string
  slug: string
  description?: string | null
  color_hex?: string | null
  image?: string | null
}

export interface ProductImage {
  id: number
  url: string
  alt_text?: string | null
  is_primary?: boolean
  sort_order?: number
}

export interface ProductVariant {
  id: number
  color?: string | null
  color_hex?: string | null
  material?: string | null
  price_modifier: number
  stock: number
  sku_suffix?: string | null
}

export interface ProductSpecification {
  key: string
  value: string
  sort_order?: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string | null
  price: number
  compare_price?: number | null
  sku?: string | null
  stock: number
  in_stock?: boolean
  is_featured?: boolean
  is_active?: boolean
  avg_rating: number
  review_count: number
  category_id?: number | null
  category?: Category | null
  space?: Space | null
  taste?: Taste | null
  images?: ProductImage[]
  variants?: ProductVariant[]
  specifications?: ProductSpecification[]
  reviews?: Array<{
    id: number
    user?: { name: string } | null
    rating: number
    comment?: string | null
    created_at?: string
  }>
  created_at?: string
  updated_at?: string
}

export interface ProductFilters {
  search?: string
  category?: string
  category_id?: number | string
  space?: string
  taste?: string
  min_price?: number | string
  max_price?: number | string
  sort?: string
  color?: string
  material?: string
  in_stock?: boolean | number
  is_featured?: boolean | number
  space_id?: number | string
  taste_id?: number | string
  page?: number | string
  per_page?: number | string
}

export interface CartItem {
  id: number
  quantity: number
  product?: {
    id: number
    name: string
    slug: string
    price: number
    compare_price?: number | null
    stock: number
    image?: string | null
  }
  variant?: ProductVariant | null
  product_name?: string
  product_image?: string | null
  variant_label?: string | null
  subtotal: number
  line_total: number
}

export interface Cart {
  cart_id: number
  items: CartItem[]
  item_count: number
  subtotal: number
  discount?: {
    code: string
    type: string
    value: number
    amount: number
  } | null
  coupon_code?: string | null
  discount_amount?: number
  shipping_cost: number
  total: number
}

export interface ShippingAddress {
  first_name: string
  last_name: string
  email?: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code?: string
  country?: string
}

export interface CheckoutPayload {
  items: Array<{
    product_id: number
    product_name: string
    quantity: number
    unit_price: number
  }>
  shipping_address: {
    full_name: string
    address_line1: string
    city: string
    region?: string
    postal_code?: string
    phone: string
  }
  payment_method: 'cod' | 'card' | 'cash' | 'bank_transfer'
  subtotal: number
  total: number
  coupon_code?: string
  notes?: string
}

export interface Order {
  id: number
  reference?: string
  status: string
  subtotal?: number
  discount_amount?: number
  shipping_cost?: number
  tax?: number
  total: number
  payment_method?: string
  payment_status?: string
  notes?: string | null
  user?: Pick<User, 'id' | 'name' | 'email'> | null
  items?: Array<{
    id: number
    product_id?: number
    product_name: string
    variant_info?: unknown
    variant_label?: string
    quantity: number
    unit_price?: number
    total: number
  }>
  shipping_address?: ShippingAddress
  created_at: string
  updated_at?: string
}

export interface SellerOrder {
  id: number
  reference?: string
  status: string
  payment_status?: string
  customer?: {
    name?: string | null
    email?: string | null
  }
  items_count: number
  seller_total: number
  items?: Array<{
    id: number
    product_id?: number
    product_name: string
    quantity: number
    unit_price?: number
    total: number
  }>
  created_at: string
  updated_at?: string
}

export interface Discount {
  id: number
  code: string
  type: 'percentage' | 'fixed' | string
  value: number
  is_active?: boolean
  starts_at?: string | null
  expires_at?: string | null
}

export interface AppSettings {
  brand_name: string
  primary_color: string
  secondary_surface: string
  facebook_url?: string | null
  instagram_name?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  support_email: string
  sales_email: string
  phone: string
  dark_luxury_theme: boolean
  promo_banner: boolean
  customer_reviews: boolean
  guest_checkout: boolean
}
