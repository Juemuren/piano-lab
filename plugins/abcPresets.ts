import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';

const projectRoot = path.resolve(import.meta.dirname, '..');
const presetsDir = path.join(projectRoot, 'public', 'presets');
const outputFile = path.join(
  projectRoot,
  'src',
  'services',
  'abc',
  'AbcPresets.json',
);

const collator = new Intl.Collator('zh-CN', {
  numeric: true,
  sensitivity: 'base',
});

async function generateAbcPresets() {
  const entries = await readdir(presetsDir, { withFileTypes: true });
  const presetNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.parse(entry.name))
    .filter(({ ext }) => ext.toLowerCase() === '.abc')
    .map(({ name }) => name)
    .sort(collator.compare);

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(presetNames, null, 2)}\n`);
}

export function abcPresets(): Plugin {
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
