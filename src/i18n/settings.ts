export const languageStorageKey = 'web-piano-simulator.language';

export const defaultLanguage = 'en-US';

export const supportedLanguages = ['en-US', 'zh-CN'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageDocumentTitles: Record<SupportedLanguage, string> = {
  'en-US': 'Piano Simulator',
  'zh-CN': '钢琴模拟器',
};

const languageAliases: Array<[prefix: string, language: SupportedLanguage]> = [
  ['en', 'en-US'],
  ['zh', 'zh-CN'],
];

export function normalizeLanguage(
  language?: string | null,
): SupportedLanguage | null {
  if (!language) return null;

  const normalized = language.toLowerCase();
  return (
    languageAliases.find(([prefix]) => normalized.startsWith(prefix))?.[1] ??
    null
  );
}
