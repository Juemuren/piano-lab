import { Eraser, PenLine, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PianoInputSettings } from '../../contexts/appSettings/AppSettingsContext';
import { getQuarterNoteSeconds } from '../../services/abc/AbcInput';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';
import ControlRange from '../shared/ControlRange';
import ControlSelect from '../shared/ControlSelect';

const DEFAULT_NOTE_LENGTH_OPTIONS = ['1/4', '1/8', '1/16'];
const TIME_SIGNATURE_OPTIONS = ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8'];
const KEY_SIGNATURE_OPTIONS = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'F',
  'Bb',
  'Eb',
  'Ab',
  'Db',
  'Gb',
  'Cb',
];

type PianoInputSettingsControlProps = {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: (enabled: boolean) => void;
  pianoInputSettings: PianoInputSettings;
  onPianoInputSettingsChange: (settings: Partial<PianoInputSettings>) => void;
  onPianoInputSettingsReset: () => void;
  onScoreBodyClear: () => void;
};

function PianoInputSettingsControl({
  isPianoInputEnabled,
  setIsPianoInputEnabled,
  pianoInputSettings,
  onPianoInputSettingsChange,
  onPianoInputSettingsReset,
  onScoreBodyClear,
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
  const timeSignatureOptions = TIME_SIGNATURE_OPTIONS.map((timeSignature) => (
    <option key={timeSignature} value={timeSignature}>
      {timeSignature}
    </option>
  ));
  const keySignatureOptions = KEY_SIGNATURE_OPTIONS.map((keySignature) => (
    <option key={keySignature} value={keySignature}>
      {keySignature}
    </option>
  ));

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        checked={isPianoInputEnabled}
        icon={<PenLine size={16} />}
        label={t('settings.pianoInputEnable')}
        onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
      />
      {isPianoInputEnabled && (
        <div className="text-sm text-app-subtext dark:text-app-subtext-dark">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
            <ControlSelect
              label={t('settings.pianoInput.defaultNoteLength')}
              onChange={(e) =>
                onPianoInputSettingsChange({
                  defaultNoteLength: e.target.value,
                })
              }
              value={pianoInputSettings.defaultNoteLength}
            >
              {defaultLengthOptions}
            </ControlSelect>
            <ControlSelect
              label={t('settings.pianoInput.timeSignature')}
              onChange={(e) =>
                onPianoInputSettingsChange({
                  timeSignature: e.target.value,
                })
              }
              value={pianoInputSettings.timeSignature}
            >
              {timeSignatureOptions}
            </ControlSelect>
            <ControlSelect
              label={t('settings.pianoInput.keySignature')}
              onChange={(e) =>
                onPianoInputSettingsChange({
                  keySignature: e.target.value,
                })
              }
              value={pianoInputSettings.keySignature}
            >
              {keySignatureOptions}
            </ControlSelect>
          </div>
          <ControlRange
            displayValue={`${pianoInputSettings.tempo}`}
            label={t('settings.pianoInput.tempo')}
            max={240}
            min={40}
            onChange={(tempo) => onPianoInputSettingsChange({ tempo })}
            p={t('settings.pianoInput.quarterNoteSeconds', {
              seconds: quarterNoteSeconds,
            })}
            step={1}
            value={pianoInputSettings.tempo}
          />
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-3">
            <ControlButton
              icon={<RotateCcw size={18} />}
              label={t('settings.pianoInput.resetHeader')}
              onClick={onPianoInputSettingsReset}
            />
            <ControlButton
              icon={<Eraser size={18} />}
              label={t('settings.pianoInput.clearScore')}
              onClick={onScoreBodyClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PianoInputSettingsControl;
