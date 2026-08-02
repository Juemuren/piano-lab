import { useTranslation } from 'react-i18next';

interface AbcSourceInputProps {
  disabled: boolean;
  onChange: (content: string) => void;
  value: string;
}

function AbcSourceInput({ disabled, value, onChange }: AbcSourceInputProps) {
  const { t } = useTranslation('score');

  return (
    <textarea
      className="my-2 h-48 w-full border border-app-border bg-app-surface/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-app-accent/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-app-border-dark dark:bg-app-surface-dark/50"
      disabled={disabled}
      id="abc-source-input"
      onChange={(e) => onChange(e.target.value)}
      placeholder={t('placeholder')}
      value={value}
    />
  );
}

export default AbcSourceInput;
