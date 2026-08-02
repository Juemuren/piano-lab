import { create } from 'zustand';
import {
  applyTheme,
  readStoredIsDarkMode,
  writeStoredIsDarkMode,
} from './themeStorage';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  isDarkMode: readStoredIsDarkMode(),
  toggleTheme: () => set(({ isDarkMode }) => ({ isDarkMode: !isDarkMode })),
}));

useThemeStore.subscribe(({ isDarkMode }) => {
  applyTheme(isDarkMode);
  writeStoredIsDarkMode(isDarkMode);
});
