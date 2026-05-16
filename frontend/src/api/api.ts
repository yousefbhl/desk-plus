import axios from 'axios'

const api = axios.create({
  // VITE_API_URL is empty string in .env — Vite proxy handles /api → localhost:8000
  baseURL: (import.meta.env.VITE_API_URL ?? '') + '/api',
  withCredentials: false,   // Bearer token auth — no cookies — no CORS preflight
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('desk_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('desk_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
