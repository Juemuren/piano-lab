import { useTranslation } from 'react-i18next';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { getQuarterNoteSeconds } from '../../services/abc/AbcInput';
import ControlCheckbox from '../shared/ControlCheckbox';
import ControlRange from '../shared/ControlRange';
import ControlSelect from '../shared/ControlSelect';

const DEFAULT_NOTE_LENGTH_OPTIONS = ['1/4', '1/8', '1/16'];

type PianoInputSettingsControlProps = {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  pianoInputSettings: PianoInputSettings;
  onPianoInputSettingsChange: (settings: Partial<PianoInputSettings>) => void;
};

function PianoInputSettingsControl({
  isPianoInputEnabled,
  setIsPianoInputEnabled,
  pianoInputSettings,
  onPianoInputSettingsChange,
}: PianoInputSettingsControlProps) {
  const { t } = useTranslation('app');
  const quarterNoteSeconds = getQuarterNoteSeconds(
    pianoInputSettings.tempo,
  ).toFixed(2);

  const defaultLengthOptions = DEFAULT_NOTE_LENGTH_OPTIONS.map((noteLength) => (
    <option key={noteLength} value={noteLength}>
      {noteLength}
    </option>
  ));

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        label={t('settings.pianoInputEnable')}
        checked={isPianoInputEnabled}
        onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
      />
      {isPianoInputEnabled && (
        <div className="text-sm text-app-overlay dark:text-app-overlay-dark">
          <ControlSelect
            label={t('settings.pianoInput.defaultNoteLength')}
            value={pianoInputSettings.defaultNoteLength}
            onChange={(e) =>
              onPianoInputSettingsChange({
                defaultNoteLength: e.target.value,
              })
            }
          >
            {defaultLengthOptions}
          </ControlSelect>
          <ControlRange
            label={t('settings.pianoInput.tempo')}
            min={40}
            max={240}
            step={1}
            value={pianoInputSettings.tempo}
            displayValue={`${pianoInputSettings.tempo}`}
            onChange={(tempo) => onPianoInputSettingsChange({ tempo })}
            p={t('settings.pianoInput.quarterNoteSeconds', {
              seconds: quarterNoteSeconds,
            })}
          />
        </div>
      )}
    </div>
  );
}

export default PianoInputSettingsControl;
