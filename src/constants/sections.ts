export const SECTION_IDS = {
  soundSynthesizer: 'sound-synthesizer',
  scoreEditor: 'score-editor',
  pianoKeyboard: 'piano-keyboard',
  settings: 'settings',
  about: 'about',
} as const;

export const NAV_ITEMS = [
  { id: SECTION_IDS.soundSynthesizer, labelKey: 'sections.soundSynthesizer' },
  { id: SECTION_IDS.scoreEditor, labelKey: 'sections.scoreEditor' },
  { id: SECTION_IDS.pianoKeyboard, labelKey: 'sections.pianoKeyboard' },
  { id: SECTION_IDS.about, labelKey: 'sections.about' },
  { id: SECTION_IDS.settings, labelKey: 'sections.settings' },
] as const;
