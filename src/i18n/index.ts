import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en/common.json';
import pianoEn from './locales/en/piano.json';
import commonZhCN from './locales/zh-CN/common.json';
import pianoZhCN from './locales/zh-CN/piano.json';

export const supportedLanguages = ['zh-CN', 'en'] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

const languageStorageKey = 'web-piano-simulator.language';

function normalizeLanguage(language?: string | null): SupportedLanguage | null {
  if (!language) return null;
  if (language.toLowerCase().startsWith('zh')) return 'zh-CN';
  if (language.toLowerCase().startsWith('en')) return 'en';
  return null;
}

const savedLanguage = normalizeLanguage(
  window.localStorage.getItem(languageStorageKey),
);
const browserLanguage = normalizeLanguage(window.navigator.language);

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': {
      common: commonZhCN,
      piano: pianoZhCN,
    },
    en: {
      common: commonEn,
      piano: pianoEn,
    },
  },
  lng: savedLanguage ?? browserLanguage ?? 'zh-CN',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'piano'],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  if (normalizedLanguage) {
    window.localStorage.setItem(languageStorageKey, normalizedLanguage);
    document.documentElement.lang = normalizedLanguage;
    document.documentElement.dir = 'ltr';
  }
});

export default i18n;
