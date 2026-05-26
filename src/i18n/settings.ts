export const LANGUAGE_STORAGE_KEY = 'web-piano-simulator.language';

export const DEFAULT_LANGUAGE = 'en-US';

export const SUPPORTED_LANGUAGES = ['en-US', 'ja-JP', 'zh-CN'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_DOCUMENT_TITLES: Record<SupportedLanguage, string> = {
  'en-US': 'Piano Simulator',
  'ja-JP': 'ピアノシミュレーター',
  'zh-CN': '钢琴模拟器',
};

export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLanguage, string> = {
  'en-US': 'English',
  'ja-JP': '日本語',
  'zh-CN': '中文',
};

const LANGUAGE_ALIASES: Array<[prefix: string, language: SupportedLanguage]> = [
  ['en', 'en-US'],
  ['ja', 'ja-JP'],
  ['zh', 'zh-CN'],
];

export function normalizeLanguage(
  language?: string | null,
): SupportedLanguage | null {
  if (!language) return null;

  const normalized = language.toLowerCase();
  return (
    LANGUAGE_ALIASES.find(([prefix]) => normalized.startsWith(prefix))?.[1] ??
    null
  );
}
