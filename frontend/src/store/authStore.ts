import { create } from 'zustand'
import { authApi } from '../api'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuth: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) => Promise<void>
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuth: false,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await authApi.login(email, password)
      localStorage.setItem('desk_token', data.token)
      set({ user: data.user, isAuth: true })
    } finally {
      set({ loading: false })
    }
  },

  register: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await authApi.register(payload)
      localStorage.setItem('desk_token', data.token)
      set({ user: data.user, isAuth: true })
    } finally {
      set({ loading: false })
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem('desk_token')

    if (!token) {
      set({ user: null, isAuth: false, loading: false })
      return
    }

    set({ loading: true })
    try {
      const { data } = await authApi.me()
      set({ user: data, isAuth: true })
    } catch {
      localStorage.removeItem('desk_token')
      set({ user: null, isAuth: false })
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem('desk_token')
      set({ user: null, isAuth: false })
    }
  },
}))
