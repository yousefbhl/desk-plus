import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/sanctum': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/logout': 'http://localhost:8000',
    },
  },
})
