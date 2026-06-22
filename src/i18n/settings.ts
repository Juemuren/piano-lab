export const LANGUAGE_STORAGE_KEY = 'piano-lab.language';

export const DEFAULT_LANGUAGE = 'en-US';

export const SUPPORTED_LANGUAGES = ['en-US', 'ja-JP', 'zh-CN'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_DOCUMENT_TITLES: Record<SupportedLanguage, string> = {
  'en-US': 'Piano Lab',
  'ja-JP': 'Piano Lab',
  'zh-CN': '弦律',
};

export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLanguage, string> = {
  'en-US': 'English',
  'ja-JP': '日本語',
  'zh-CN': '中文',
};

const LANGUAGE_ALIASES: Array<{ language: string; alias: SupportedLanguage }> =
  [
    { alias: 'en-US', language: 'en' },
    { alias: 'ja-JP', language: 'ja' },
    { alias: 'zh-CN', language: 'zh' },
  ];

export function normalizeLanguage(
  language?: string | null,
): SupportedLanguage | null {
  if (!language) return null;

  const loweredLanguage = language.toLowerCase();
  return (
    LANGUAGE_ALIASES.find((languageAlias) =>
      loweredLanguage.startsWith(languageAlias.language),
    )?.alias ?? null
  );
}
