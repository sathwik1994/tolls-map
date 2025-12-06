import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // Change 'tolls-map' to match your GitHub repository name
  base: '/tolls-map/',
  // Environment variables with VITE_ prefix are automatically available
  // Access them using import.meta.env.VITE_*
  define: {
    'process.env': {}
  }
})
