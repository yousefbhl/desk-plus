export type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'

export interface ProductImage {
  id: number
  url: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  images: ProductImage[]
  category?: string
  space?: string
  taste?: string
  in_stock: boolean
}

export interface OrderItem {
  product_id: number
  quantity: number
  price: number
}

export interface Order {
  id: number
  status: OrderStatus
  total: number
  items?: OrderItem[]
}

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
}
