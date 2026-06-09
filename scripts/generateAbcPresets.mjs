import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(fileURLToPath(import.meta.url), '..', '..');
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

export async function generateAbcPresets() {
  const entries = await readdir(presetsDir, { withFileTypes: true });
  const presetNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.parse(entry.name))
    .filter(({ ext }) => ext.toLowerCase() === '.abc')
    .map(({ name }) => name)
    .sort(collator.compare);

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(presetNames, null, 2)}\n`);

  return presetNames;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const presetNames = await generateAbcPresets();
  console.log(`Generated ${path.relative(projectRoot, outputFile)}`);
  console.log(`Found ${presetNames.length} ABC presets.`);
}
