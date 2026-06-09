import type { SupportedLanguage } from './settings';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_DOCUMENT_TITLES,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguage,
} from './settings';

function getStoredLanguage() {
  try {
    return normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return null;
  }
}

function getBrowserLanguage() {
  return (window.navigator.languages || [window.navigator.language])
    .map(normalizeLanguage)
    .find(Boolean);
}

export function getInitialLanguage(): SupportedLanguage {
  return getStoredLanguage() ?? getBrowserLanguage() ?? DEFAULT_LANGUAGE;
}

export function syncDocumentLanguage(language: SupportedLanguage) {
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr';
  document.title = LANGUAGE_DOCUMENT_TITLES[language];
}

export function bootstrapDocumentLanguage() {
  syncDocumentLanguage(getInitialLanguage());
}
