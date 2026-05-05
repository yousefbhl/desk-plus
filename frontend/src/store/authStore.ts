import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../api';

interface AuthState {
  user:       User | null;
  token:      string | null;
  loading:    boolean;     // ← FIX: loading state prevents AuthGuard redirect before fetchUser resolves
  isAuth:     boolean;
  setUser:    (user: User | null) => void;
  login:      (email: string, password: string) => Promise<void>;
  register:   (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) => Promise<void>;
  logout:     () => Promise<void>;
  fetchUser:  () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:    null,
      token:   null,
      loading: true,
      isAuth:  false,

      setUser: (user) => set({ user, isAuth: !!user }),

      login: async (email, password) => {
        const { data } = await authApi.login(email, password);
        localStorage.setItem('desk_token', data.token);
        set({ user: data.user, token: data.token, isAuth: true, loading: false });
      },

      register: async (formData) => {
        const { data } = await authApi.register(formData);
        localStorage.setItem('desk_token', data.token);
        set({ user: data.user, token: data.token, isAuth: true, loading: false });
      },

      logout: async () => {
        try { await authApi.logout(); } catch { /* ignore */ }
        localStorage.removeItem('desk_token');
        set({ user: null, token: null, isAuth: false, loading: false });
        window.location.href = '/login';
      },

      fetchUser: async () => {
        const token = localStorage.getItem('desk_token');
        if (!token) {
          set({ loading: false, isAuth: false });
          return;
        }
        try {
          const { data } = await authApi.me();
          set({ user: data, isAuth: true, loading: false });
        } catch {
          localStorage.removeItem('desk_token');
          set({ user: null, token: null, isAuth: false, loading: false });
        }
      },
    }),
    {
      name: 'desk-auth',
      partialize: (state) => ({ token: state.token }), // only persist token
    }
  )
);

