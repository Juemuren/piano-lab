import presetsNames from './AbcPresets.json';

export const ABC_PRESETS = presetsNames;

export async function getAbcPreset(index: number) {
  const name = ABC_PRESETS[index];
  const path = `presets/${name}.abc`;
  const response = await fetch(path);
  return await response.text();
}
