import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '../api'
import { useWishlistStore } from '../store/wishlistStore'
import type { Product } from '../types'

export function useWishlist() {
  const setProductIds = useWishlistStore((s) => s.setProductIds)

  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const r = await wishlistApi.list()
      const products = (r.data?.data ?? r.data) as Product[]
      setProductIds(products.map((p) => p.id))
      return products
    },
  })
}

export function useToggleWishlist() {
  const qc = useQueryClient()
  const toggle = useWishlistStore((s) => s.toggle)

  return useMutation({
    mutationFn: (productId: number) =>
      wishlistApi.toggle(productId).then((r) => r.data),
    onMutate: (productId) => {
      toggle(productId)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] })
    },
    onError: (_err, productId) => {
      toggle(productId)
    },
  })
}
