import { create } from 'zustand'
import { login as loginApi, logout as logoutApi, me } from '../api/auth'
import type { User } from '../types/types'

type AuthState = {
  user: User | null
  loading: boolean
  fetchUser: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    set({ loading: true })
    try {
      const user = await me()
      set({ user })
    } finally {
      set({ loading: false })
    }
  },
  login: async (email, password) => {
    set({ loading: true })
    try {
      await loginApi(email, password)
      const user = await me()
      set({ user })
    } finally {
      set({ loading: false })
    }
  },
  logout: async () => {
    await logoutApi()
    set({ user: null })
  },
}))

export default useAuth
