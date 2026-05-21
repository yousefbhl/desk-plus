import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  productIds: number[]
  setProductIds: (ids: number[]) => void
  toggle: (productId: number) => void
  isWishlisted: (productId: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      setProductIds: (ids) => set({ productIds: ids }),
      toggle: (productId) => {
        const ids = get().productIds
        if (ids.includes(productId)) {
          set({ productIds: ids.filter((id) => id !== productId) })
        } else {
          set({ productIds: [...ids, productId] })
        }
      },
      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    { name: 'desk-wishlist' }
  )
)
