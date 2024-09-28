import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1004
  },
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
