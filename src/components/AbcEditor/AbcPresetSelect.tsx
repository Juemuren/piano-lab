import { ListMusic } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ABC_PRESETS } from '../../services/abc/AbcPresets';
import ControlSelect from '../shared/ControlSelect';

interface AbcPresetSelectProps {
  onPresetChange: (presetIndex: number) => void;
  selectedPresetIndex: number;
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
      icon={<ListMusic size={16} />}
      label={t('preset')}
      onChange={(e) => onPresetChange(parseInt(e.target.value, 10))}
      value={selectedPresetIndex}
    >
      <option value={-1}>{t('custom')}</option>
      {persetsOptions}
    </ControlSelect>
  );
}

export default AbcPresetSelect;
