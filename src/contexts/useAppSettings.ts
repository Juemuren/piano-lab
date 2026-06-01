import { useContext } from 'react';
import { AppSettingsContext } from './AppSettingsContextValue';

export function useAppSettings() {
  const settings = useContext(AppSettingsContext);

  if (!settings) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return settings;
}
