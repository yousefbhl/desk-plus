import { create } from 'zustand'
import { cartApi } from '../api'
import type { Cart } from '../types'

interface CartState {
  cart:         Cart | null
  loading:      boolean
  fetchCart:    () => Promise<void>
  addItem:      (productId: number, variantId?: number, quantity?: number) => Promise<void>
  updateItem:   (cartItemId: number, quantity: number) => Promise<void>
  removeItem:   (cartItemId: number) => Promise<void>
  clearCart:    () => Promise<void>
  applyCoupon:  (code: string) => Promise<void>
  removeCoupon: () => Promise<void>
  itemCount:    () => number
  total:        () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart:    null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const { data } = await cartApi.get()
      set({ cart: data })
    } catch {
      // Not logged in — cart stays null
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ loading: true })
    try {
      const { data } = await cartApi.addItem(productId, variantId, quantity)
      set({ cart: data })
    } finally {
      set({ loading: false })
    }
  },

  updateItem: async (cartItemId, quantity) => {
    const { data } = await cartApi.updateItem(cartItemId, quantity)
    set({ cart: data })
  },

  removeItem: async (cartItemId) => {
    const { data } = await cartApi.removeItem(cartItemId)
    set({ cart: data })
  },

  clearCart: async () => {
    await cartApi.clear()
    set({ cart: null })
  },

  applyCoupon: async (code) => {
    const { data } = await cartApi.applyCoupon(code)
    set({ cart: data })
  },

  removeCoupon: async () => {
    const { data } = await cartApi.removeCoupon()
    set({ cart: data })
  },

  itemCount: () => get().cart?.item_count ?? 0,
  total:     () => get().cart?.total ?? 0,
}))
