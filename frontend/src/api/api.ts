// frontend/src/api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true,
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor — attach Sanctum token ───────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('desk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Attach guest session ID for cart
  const sessionId = getOrCreateSessionId();
  config.headers['X-Session-ID'] = sessionId;
  return config;
});

// ── Response interceptor — handle 401 globally ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('desk_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Guest session ID ─────────────────────────────────────────
function getOrCreateSessionId(): string {
  let id = localStorage.getItem('desk_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('desk_session_id', id);
  }
  return id;
}

export default api;
