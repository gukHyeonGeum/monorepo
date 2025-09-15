import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  base: '/web-app/',
  plugins: [react(), tailwindcss(), visualizer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
