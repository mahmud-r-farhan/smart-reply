import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Ensure service worker is not processed as module
    rollupOptions: {
      input: {
        main: '/index.html',
      },
    },
  },
  server: {
    // Ensure service worker is served correctly in dev
    mimeTypes: {
      'application/javascript': ['js'],
    },
  },
})
