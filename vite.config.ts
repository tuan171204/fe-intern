import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/v1": { target: "http://localhost:5035", changeOrigin: true },
      "/uploads": { target: "http://localhost:5035", changeOrigin: true },
    },
  },
})
