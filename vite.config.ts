import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    cors: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    },
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 3000,
    host: true
  }
});