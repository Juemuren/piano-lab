import {
  defaultLanguage,
  languageDocumentTitles,
  languageStorageKey,
  normalizeLanguage,
  type SupportedLanguage,
} from './settings';

function getStoredLanguage() {
  try {
    return normalizeLanguage(window.localStorage.getItem(languageStorageKey));
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
  return getStoredLanguage() ?? getBrowserLanguage() ?? defaultLanguage;
}

export function syncDocumentLanguage(language: SupportedLanguage) {
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr';
  document.title = languageDocumentTitles[language];
}

export function bootstrapDocumentLanguage() {
  syncDocumentLanguage(getInitialLanguage());
}
