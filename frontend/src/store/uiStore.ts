import { create } from 'zustand'

interface UiState {
  isCartDrawerOpen: boolean
  openCart:  () => void
  closeCart: () => void
  toast: { message: string; type: 'success' | 'error' | 'info' } | null
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  isCartDrawerOpen: false,
  openCart:  () => set({ isCartDrawerOpen: true }),
  closeCart: () => set({ isCartDrawerOpen: false }),
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } })
    setTimeout(() => set({ toast: null }), 3000)
  },
  clearToast: () => set({ toast: null }),
}))
