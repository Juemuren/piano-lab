import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getInitialLanguage, syncDocumentLanguage } from './bootstrap';
import appEn from './locales/en-US/app.json';
import footerEn from './locales/en-US/footer.json';
import scoreEn from './locales/en-US/score.json';
import synthEn from './locales/en-US/synth.json';
import appJaJP from './locales/ja-JP/app.json';
import footerJaJP from './locales/ja-JP/footer.json';
import scoreJaJP from './locales/ja-JP/score.json';
import synthJaJP from './locales/ja-JP/synth.json';
import appZhCN from './locales/zh-CN/app.json';
import footerZhCN from './locales/zh-CN/footer.json';
import scoreZhCN from './locales/zh-CN/score.json';
import synthZhCN from './locales/zh-CN/synth.json';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
} from './settings';

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  defaultNS: 'common',
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  lng: initialLanguage,
  ns: ['app', 'common', 'footer', 'score', 'synth'],
  resources: {
    'en-US': {
      app: appEn,
      footer: footerEn,
      score: scoreEn,
      synth: synthEn,
    },
    'ja-JP': {
      app: appJaJP,
      footer: footerJaJP,
      score: scoreJaJP,
      synth: synthJaJP,
    },
    'zh-CN': {
      app: appZhCN,
      footer: footerZhCN,
      score: scoreZhCN,
      synth: synthZhCN,
    },
  },
});

syncDocumentLanguage(initialLanguage);

i18n.on('languageChanged', (language) => {
  const normalizedLanguage = normalizeLanguage(language);
  if (normalizedLanguage) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    syncDocumentLanguage(normalizedLanguage);
  }
});

export default i18n;
