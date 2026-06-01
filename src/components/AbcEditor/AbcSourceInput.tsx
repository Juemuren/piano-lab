import { useTranslation } from 'react-i18next';

interface AbcSourceInputProps {
  value: string;
  onChange: (content: string) => void;
}

function AbcSourceInput({ value, onChange }: AbcSourceInputProps) {
  const { t } = useTranslation('score');

  return (
    <textarea
      id="abc-source-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('placeholder')}
      className="
        w-full h-48 p-4 my-2 text-sm
        bg-app-surface-muted/75 dark:bg-app-surface-muted-dark/25
        border border-app-border dark:border-app-border-dark
        focus:outline-none focus:ring-2 focus:ring-app-accent/50
      "
    />
  );
}

export default AbcSourceInput;
