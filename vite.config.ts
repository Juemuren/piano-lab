import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
// https://tauri.app/start/frontend/vite/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.TAURI_ENV_PLATFORM ? './' : '/web-piano-simulator/',
  server: {
    port: 5173,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10000,
          maxSize: 250000,
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
            },
          ],
        },
      },
    },
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
