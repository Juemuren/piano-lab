import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin, ViteDevServer } from 'vite';
import { defineConfig } from 'vite';
import { generateAbcPresets } from './scripts/generateAbcPresets.mjs';

function abcPresets(): Plugin {
  return {
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
    name: 'abc-presets',
  };
}

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
// https://tauri.app/start/frontend/vite/
export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              priority: 20,
              test: /node_modules[\\/]react/,
            },
            {
              name: 'vendor',
              priority: 10,
              test: /node_modules/,
            },
          ],
          maxSize: 500000,
          minSize: 20000,
        },
      },
    },
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    target:
      process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
  },
  define: {
    global: 'globalThis',
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  plugins: [abcPresets(), react(), tailwindcss()],
  server: {
    hmr: host
      ? {
          host,
          port: 1421,
          protocol: 'ws',
        }
      : undefined,
    host: host || false,
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
