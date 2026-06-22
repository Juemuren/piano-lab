import { useTranslation } from 'react-i18next';

interface AbcSourceInputProps {
  onChange: (content: string) => void;
  value: string;
}

function AbcSourceInput({ value, onChange }: AbcSourceInputProps) {
  const { t } = useTranslation('score');

  return (
    <textarea
      className="
        w-full h-48 p-4 my-2 text-sm
        bg-app-surface/50 dark:bg-app-surface-dark/50
        border border-app-border dark:border-app-border-dark
        focus:outline-none focus:ring-2 focus:ring-app-accent/50
      "
      id="abc-source-input"
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('placeholder')}
      value={value}
    />
  );
}

export default AbcSourceInput;
