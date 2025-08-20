import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // 0.0.0.0 inside the container
    port: 5173,     // dev UI on :5173
    proxy: {
      '/graphql': {
        target: 'http://server:4000', // 👈 talk to Compose service "server"
        changeOrigin: true,
        ws: true,
      },
    },
  },
})