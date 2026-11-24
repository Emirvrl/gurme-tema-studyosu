import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages alt klasörde yayınlar; göreli yol her depo adında çalışır
  base: './',
  server: { port: 5173 },
});
