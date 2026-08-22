import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 1000
    },
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Handshake timeout or backend offline:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`Routing secure proxy pipe -> ${req.method} ${req.url}`);
          });
        },
      }
    }
  }
})
