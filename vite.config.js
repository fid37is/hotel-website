import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    headers: {
      // Allow HMS admin (5173) to embed this site in an iframe
      'Content-Security-Policy': "frame-ancestors 'self' http://localhost:5173",
    },
    proxy: {
      '/api': {
        target:       'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});