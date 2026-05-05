// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API + Sanctum requests to Laravel during development
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

// ============================================================
// frontend/.env.local  — LOCAL
// ============================================================
// VITE_API_URL=http://localhost:8000

// ============================================================
// frontend/.env.production  — PRODUCTION (set in Vercel)
// ============================================================
// VITE_API_URL=https://your-laravel-app.railway.app
