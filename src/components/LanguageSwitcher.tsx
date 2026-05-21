import { useTranslation } from 'react-i18next';
import { languageDisplayNames, supportedLanguages } from '../i18n';
import ControlSelect from './shared/ControlSelect';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <label
      className="flex w-40 items-center gap-2 text-sm
      text-app-muted dark:text-app-muted-dark"
    >
      <ControlSelect
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language}>
            {languageDisplayNames[language]}
          </option>
        ))}
      </ControlSelect>
    </label>
  );
}

export default LanguageSwitcher;
