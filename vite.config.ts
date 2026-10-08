import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { target: ['chrome109', 'firefox115', 'safari16.4'], sourcemap: false },
  server: { strictPort: true },
  preview: { strictPort: true },
})
