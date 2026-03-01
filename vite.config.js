// vite.config.js
import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Proxy API calls in dev so you don't need CORS configured locally
      '/api': {
        target:      'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
