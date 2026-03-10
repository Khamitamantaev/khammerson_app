import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  base: '/',
  
  server: {
    host: true,
    port: 3006,
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Убираем несуществующие пакеты из manualChunks
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})