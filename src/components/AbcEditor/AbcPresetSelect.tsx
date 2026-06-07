import { useTranslation } from 'react-i18next';
import { ABC_PRESETS } from '../../services/abc/AbcPresets';
import ControlSelect from '../shared/ControlSelect';

interface AbcPresetSelectProps {
  selectedPresetIndex: number;
  onPresetChange: (presetIndex: number) => void;
}

function AbcPresetSelect({
  selectedPresetIndex,
  onPresetChange,
}: AbcPresetSelectProps) {
  const { t } = useTranslation('score');

  const persetsOptions = ABC_PRESETS.map((name, index) => (
    <option key={name} value={index}>
      {t(`presets.${name}`)}
    </option>
  ));

  return (
    <ControlSelect
      label={t('preset')}
      value={selectedPresetIndex}
      onChange={(e) => onPresetChange(parseInt(e.target.value, 10))}
    >
      <option value={-1}>{t('custom')}</option>
      {persetsOptions}
    </ControlSelect>
  );
}

export default AbcPresetSelect;
