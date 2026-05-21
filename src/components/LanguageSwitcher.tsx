import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';
import ControlSelect from './shared/ControlSelect';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation('common');

  return (
    <label
      className="flex w-40 items-center gap-2 text-sm
      text-app-muted dark:text-app-muted-dark"
    >
      <span className="shrink-0 whitespace-nowrap">{t('language.label')}</span>
      <ControlSelect
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value);
        }}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language}>
            {t(`language.${language}`)}
          </option>
        ))}
      </ControlSelect>
    </label>
  );
}

export default LanguageSwitcher;
