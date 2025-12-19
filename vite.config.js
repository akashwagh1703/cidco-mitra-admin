import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cidco-mitra-admin/',
  plugins: [react()],
})