import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' so the built site works from any folder, including GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
})
