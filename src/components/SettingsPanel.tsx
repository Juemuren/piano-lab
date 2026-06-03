import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../contexts/appSettings';
import { useMidiControlContext } from '../contexts/midiControl';
import type { MidiInputDevice, MidiStatus } from '../types';
import { getQuarterNoteSeconds } from '../services/abc/AbcInput';
import type { PianoInputSettings } from '../contexts/appSettings/AppSettingsContext';
import ControlCheckbox from './shared/ControlCheckbox';
import ControlField from './shared/ControlField';
import ControlPanel from './shared/ControlPanel';
import ControlRange from './shared/ControlRange';
import ControlSelect from './shared/ControlSelect';

const DEFAULT_NOTE_LENGTH_OPTIONS = ['1/4', '1/8', '1/16'];

interface SettingsPanelProps {
  onPianoInputSettingsChange: (settings: Partial<PianoInputSettings>) => void;
}

function getMidiStatusMessageKey(status: MidiStatus, deviceCount: number) {
  if (status === 'unsupported') {
    return 'settings.midi.status.unsupported';
  }
  if (status === 'requesting') {
    return 'settings.midi.status.requesting';
  }
  if (status === 'error') {
    return 'settings.midi.status.error';
  }
  if (deviceCount === 0) {
    return 'settings.midi.status.noDevices';
  }
  return '';
}

function getMidiDeviceName(device: MidiInputDevice) {
  if (!device.manufacturer) {
    return device.name;
  }
  return `${device.manufacturer} ${device.name}`;
}

function SettingsPanel({ onPianoInputSettingsChange }: SettingsPanelProps) {
  const { t } = useTranslation('app');
  const { midiControl, selectedMidiInputId, setSelectedMidiInputId } =
    useMidiControlContext();
  const {
    isPianoInputEnabled,
    setIsPianoInputEnabled,
    pianoInputSettings,
    isKeyboardControlEnabled,
    setIsKeyboardControlEnabled,
    isMouseControlEnabled,
    setIsMouseControlEnabled,
    isTouchControlEnabled,
    setIsTouchControlEnabled,
    isMidiControlEnabled,
    setIsMidiControlEnabled,
  } = useAppSettings();
  const midiStatusMessageKey = getMidiStatusMessageKey(
    midiControl.status,
    midiControl.devices.length,
  );
  const selectedDeviceId = midiControl.devices.some(
    (device) => device.id === selectedMidiInputId,
  )
    ? selectedMidiInputId
    : midiControl.activeInputId;
  const quarterNoteSeconds = getQuarterNoteSeconds(
    pianoInputSettings.tempo,
  ).toFixed(2);

  const updatePianoInputSettings = (
    settings: Partial<typeof pianoInputSettings>,
  ) => {
    onPianoInputSettingsChange(settings);
  };

  return (
    <ControlPanel className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ControlCheckbox
          label={t('settings.keyboardControl')}
          checked={isKeyboardControlEnabled}
          onChange={(e) => setIsKeyboardControlEnabled(e.target.checked)}
        />
        <ControlCheckbox
          label={t('settings.mouseControl')}
          checked={isMouseControlEnabled}
          onChange={(e) => setIsMouseControlEnabled(e.target.checked)}
        />
        <ControlCheckbox
          label={t('settings.touchControl')}
          checked={isTouchControlEnabled}
          onChange={(e) => setIsTouchControlEnabled(e.target.checked)}
        />
        <ControlCheckbox
          label={t('settings.midiControl')}
          checked={isMidiControlEnabled}
          onChange={(e) => setIsMidiControlEnabled(e.target.checked)}
        />
        <ControlCheckbox
          label={t('settings.pianoInputEnable')}
          checked={isPianoInputEnabled}
          onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
        />
      </div>

      {isKeyboardControlEnabled && (
        <p className="text-sm text-app-muted dark:text-app-muted-dark">
          {t('settings.keyboard.hint')}
        </p>
      )}

      {isPianoInputEnabled && (
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <ControlField label={t('settings.pianoInput.defaultNoteLength')}>
            <ControlSelect
              value={pianoInputSettings.defaultNoteLength}
              onChange={(e) =>
                updatePianoInputSettings({
                  defaultNoteLength: e.target.value,
                })
              }
            >
              {DEFAULT_NOTE_LENGTH_OPTIONS.map((noteLength) => (
                <option key={noteLength} value={noteLength}>
                  {noteLength}
                </option>
              ))}
            </ControlSelect>
          </ControlField>
          <ControlRange
            label={t('settings.pianoInput.tempo')}
            min={40}
            max={240}
            step={1}
            value={pianoInputSettings.tempo}
            displayValue={`${pianoInputSettings.tempo}`}
            onChange={(tempo) => updatePianoInputSettings({ tempo })}
          />
          <p className="sm:col-span-2 text-center text-app-muted dark:text-app-muted-dark">
            {t('settings.pianoInput.quarterNoteSeconds', {
              seconds: quarterNoteSeconds,
            })}
          </p>
        </div>
      )}

      {isMidiControlEnabled && (
        <div className="text-sm text-app-muted dark:text-app-muted-dark">
          {midiStatusMessageKey && <p>{t(midiStatusMessageKey)}</p>}
          {midiControl.devices.length > 0 && (
            <ControlField label={t('settings.midi.inputDevice')}>
              <ControlSelect
                value={selectedDeviceId}
                onChange={(e) => setSelectedMidiInputId(e.target.value)}
              >
                {midiControl.devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {getMidiDeviceName(device)}
                  </option>
                ))}
              </ControlSelect>
            </ControlField>
          )}
        </div>
      )}
    </ControlPanel>
  );
}

export default SettingsPanel;
