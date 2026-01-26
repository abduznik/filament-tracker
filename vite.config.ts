import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/filament-tracker/',
  define: {
    'import.meta.env.VITE_USE_SQLITE': JSON.stringify(process.env.VITE_USE_SQLITE)
  }
})