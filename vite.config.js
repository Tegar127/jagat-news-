import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This can be useful for Docker and other environments
    hmr: {
        host: 'localhost',
    },
    watch: {
        usePolling: true,
    },
    // Add this to allow your ngrok host
    allowedHosts: ['51a4-2a09-bac5-3a27-25c3-00-3c3-9.ngrok-free.app'],
  },
})