import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en-US/common.json';
import pianoEn from './locales/en-US/piano.json';
import commonZhCN from './locales/zh-CN/common.json';
import pianoZhCN from './locales/zh-CN/piano.json';
import {
  getInitialLanguage,
  syncDocumentLanguage,
} from './bootstrap';
import {
  defaultLanguage,
  languageStorageKey,
  normalizeLanguage,
  supportedLanguages,
} from './settings';

export { defaultLanguage, supportedLanguages };
export type { SupportedLanguage } from './settings';

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    'en-US': {
      common: commonEn,
      piano: pianoEn,
    },
    'zh-CN': {
      common: commonZhCN,
      piano: pianoZhCN,
    },
  },
  lng: initialLanguage,
  fallbackLng: defaultLanguage,
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
