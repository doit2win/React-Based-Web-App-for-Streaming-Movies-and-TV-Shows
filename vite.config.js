import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build can be served from any static path
  base: './',
  // vite.config.js
  server: {
    // Expose on all network interfaces
    host: '0.0.0.0',
    // History API Fallback
    historyApiFallback: true,
  }
})
