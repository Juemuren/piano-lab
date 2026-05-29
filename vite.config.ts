import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { generateAbcPresets } from './scripts/generateAbcPresets.mjs';

const host = process.env.TAURI_DEV_HOST;

function abcPresets(): Plugin {
  return {
    name: 'abc-presets',
    async buildStart() {
      await generateAbcPresets();
    },
    configureServer(server: ViteDevServer) {
      server.watcher.add('public/presets/*.abc');
      server.watcher.on('add', async (file: string) => {
        if (file.endsWith('.abc')) {
          await generateAbcPresets();
        }
      });
      server.watcher.on('unlink', async (file: string) => {
        if (file.endsWith('.abc')) {
          await generateAbcPresets();
        }
      });
    },
  };
}

// https://vite.dev/config/
// https://tauri.app/start/frontend/vite/
export default defineConfig({
  plugins: [abcPresets(), react(), tailwindcss()],
  base: process.env.TAURI_ENV_PLATFORM ? './' : '/web-piano-simulator/',
  define: {
    global: 'globalThis',
  },
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
          minSize: 20000,
          maxSize: 500000,
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/]react/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
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
