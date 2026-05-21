import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en-US/common.json';
import pianoEn from './locales/en-US/piano.json';
import commonZhCN from './locales/zh-CN/common.json';
import pianoZhCN from './locales/zh-CN/piano.json';

export const supportedLanguages = ['zh-CN', 'en-US'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const languageStorageKey = 'web-piano-simulator.language';

function normalizeLanguage(language?: string | null): SupportedLanguage | null {
  if (!language) return null;
  if (language.toLowerCase().startsWith('zh')) return 'zh-CN';
  if (language.toLowerCase().startsWith('en')) return 'en-US';
  return null;
}

function syncDocumentLanguage(language: SupportedLanguage) {
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr';
  document.title = i18n.t('piano:app.title', { lng: language });
}

const savedLanguage = normalizeLanguage(
  window.localStorage.getItem(languageStorageKey),
);
const browserLanguage = (
  window.navigator.languages || [window.navigator.language]
)
  .map(normalizeLanguage)
  .find(Boolean);
const initialLanguage = savedLanguage ?? browserLanguage ?? 'zh-CN';

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': {
      common: commonZhCN,
      piano: pianoZhCN,
    },
    'en-US': {
      common: commonEn,
      piano: pianoEn,
    },
  },
  lng: initialLanguage,
  fallbackLng: 'en-US',
  defaultNS: 'common',
  ns: ['common', 'piano'],
  interpolation: {
    escapeValue: false,
  },
});

syncDocumentLanguage(initialLanguage);

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  if (normalizedLanguage) {
    window.localStorage.setItem(languageStorageKey, normalizedLanguage);
    syncDocumentLanguage(normalizedLanguage);
  }
});

export default i18n;
