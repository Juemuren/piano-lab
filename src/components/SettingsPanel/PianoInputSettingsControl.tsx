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
        label={t('settings.pianoInputEnable')}
        icon={<PenLine size={16} />}
        checked={isPianoInputEnabled}
        onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
      />
      {isPianoInputEnabled && (
        <div className="text-sm text-app-subtext dark:text-app-subtext-dark">
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
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
            <ControlSelect
              label={t('settings.pianoInput.timeSignature')}
              value={pianoInputSettings.timeSignature}
              onChange={(e) =>
                onPianoInputSettingsChange({
                  timeSignature: e.target.value,
                })
              }
            >
              {timeSignatureOptions}
            </ControlSelect>
            <ControlSelect
              label={t('settings.pianoInput.keySignature')}
              value={pianoInputSettings.keySignature}
              onChange={(e) =>
                onPianoInputSettingsChange({
                  keySignature: e.target.value,
                })
              }
            >
              {keySignatureOptions}
            </ControlSelect>
          </div>
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
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-3">
            <ControlButton
              label={t('settings.pianoInput.resetHeader')}
              icon={<RotateCcw size={18} />}
              onClick={onPianoInputSettingsReset}
            />
            <ControlButton
              label={t('settings.pianoInput.clearScore')}
              icon={<Eraser size={18} />}
              onClick={onScoreBodyClear}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PianoInputSettingsControl;
