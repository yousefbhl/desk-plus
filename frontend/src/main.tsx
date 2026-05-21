import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:           1000 * 60 * 5,
      retry:               1,
      refetchOnWindowFocus: false,
    },
  },
})

// Only rehydrate auth if a token actually exists — no wasted API call on login page
import('./store/authStore').then(({ useAuthStore }) => {
  if (localStorage.getItem('desk_token')) {
    useAuthStore.getState().fetchUser().then(() => {
      if (useAuthStore.getState().isAuth) {
        import('./api').then(({ wishlistApi }) => {
          wishlistApi.list().then((r) => {
            const products = (r.data?.data ?? r.data) as { id: number }[]
            import('./store/wishlistStore').then(({ useWishlistStore }) => {
              useWishlistStore.getState().setProductIds(products.map((p) => p.id))
            })
          }).catch(() => {})
        })
      }
    })
  } else {
    useAuthStore.getState().setLoading(false)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
