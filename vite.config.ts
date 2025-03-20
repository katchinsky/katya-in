import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Ensure correct static file serving
  publicDir: 'public',
  
  server: {
    fs: {
      // Allow serving files from the public directory
      allow: ['public', 'src']
    },
    // Enable detailed logging
    hmr: {
      overlay: true
    }
  },
  
  build: {
    // Enable code splitting and dynamic imports
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,  // Keep console logs for debugging
        drop_debugger: true
      }
    },
    // Faster build
    chunkSizeWarningLimit: 1500,
    
    // Detailed source maps for better debugging
    sourcemap: true
  },
  
  // Improve performance
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'gray-matter', 
      'react-markdown'
    ]
  },

  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
