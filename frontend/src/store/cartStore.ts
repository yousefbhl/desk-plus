import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

export interface LocalCartItem {
  productId: number
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  image?: string | null
  quantity: number
}

interface CartState {
  items: LocalCartItem[]
  addItem:    (product: Product, qty?: number) => void
  removeItem: (productId: number) => void
  updateQty:  (productId: number, qty: number) => void
  clear:      () => void
  total:      () => number
  itemCount:  () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items = get().items
        const existing = items.find((i) => i.productId === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + qty }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                comparePrice: product.compare_price,
                image: product.images?.[0]?.url ?? null,
                quantity: qty,
              },
            ],
          })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity: qty } : i
            ),
          })
        }
      },

      clear: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'desk-cart' }
  )
)
