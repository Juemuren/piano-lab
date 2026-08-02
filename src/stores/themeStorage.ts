const THEME_STORAGE_KEY = 'piano-lab:dark-mode';

export const DEFAULT_IS_DARK_MODE = true;

export function readStoredIsDarkMode() {
  const storedIsDarkMode = localStorage.getItem(THEME_STORAGE_KEY);
  return storedIsDarkMode === null
    ? DEFAULT_IS_DARK_MODE
    : storedIsDarkMode === 'true';
}

export function writeStoredIsDarkMode(isDarkMode: boolean) {
  localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
}

export function applyTheme(isDarkMode: boolean) {
  document.documentElement.classList.toggle('dark', isDarkMode);
}

export function bootstrapTheme() {
  applyTheme(readStoredIsDarkMode());
}
