import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import {
  LANGUAGE_DISPLAY_NAMES,
  SUPPORTED_LANGUAGES,
} from '../../i18n/settings';
import ControlSelect from '../shared/ControlSelect';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languageOptions = SUPPORTED_LANGUAGES.map((language) => (
    <option key={language} value={language}>
      {LANGUAGE_DISPLAY_NAMES[language]}
    </option>
  ));

  return (
    <label className="flex items-center gap-2 text-sm">
      <Languages
        size={18}
        className="shrink-0 text-app-muted dark:text-app-muted-dark"
      />
      <ControlSelect
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={(e) => {
          i18n.changeLanguage(e.target.value);
        }}
      >
        {languageOptions}
      </ControlSelect>
    </label>
  );
}

export default LanguageSwitcher;
