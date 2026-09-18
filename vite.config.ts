import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // The AI endpoints live in the Express server (server/index.ts) so the Groq
    // key never reaches the browser. Without this proxy the UI gets a 404.
    proxy: {
      '/api': `http://localhost:${process.env.API_PORT ?? 8787}`,
    },
  },
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },
})
