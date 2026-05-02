import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types/types'

type CartItem = Product & { qty: number }

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  clear: () => void
  total: () => number
}

const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id)
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
            ),
          })
          return
        }

        set({ items: [...get().items, { ...product, qty: 1 }] })
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.qty, 0),
    }),
    { name: 'desk-cart' },
  ),
)

export default useCart
