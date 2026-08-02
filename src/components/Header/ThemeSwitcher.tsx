import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import ControlButton from '../shared/ControlButton';

function ThemeSwitcher() {
  const { t } = useTranslation('app');
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <ControlButton
      bgClassName="bg-transparent hover:bg-app-overlay/50 dark:hover:bg-app-overlay-dark/50"
      icon={isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      onClick={toggleTheme}
      title={t(
        isDarkMode
          ? 'themeSwitcher.switchToLight'
          : 'themeSwitcher.switchToDark',
      )}
    />
  );
}

export default ThemeSwitcher;
