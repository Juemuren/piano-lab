import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../contexts/useAppSettings';
import type {
  MidiControlState,
  MidiInputDevice,
  MidiStatus,
} from '../hooks/piano/useMidiControl';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';

interface SettingsPanelProps {
  midiControl: MidiControlState;
  selectedMidiInputId: string;
  onSelectedMidiInputIdChange: (inputId: string) => void;
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

function SettingsPanel({
  midiControl,
  selectedMidiInputId,
  onSelectedMidiInputIdChange,
}: SettingsPanelProps) {
  const { t } = useTranslation('app');
  const {
    isPianoInputEnabled,
    setIsPianoInputEnabled,
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

  return (
    <ControlPanel className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isKeyboardControlEnabled}
            onChange={(e) => setIsKeyboardControlEnabled(e.target.checked)}
            className="size-4 accent-app-accent"
          />
          <span>{t('settings.keyboardControl')}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isMouseControlEnabled}
            onChange={(e) => setIsMouseControlEnabled(e.target.checked)}
            className="size-4 accent-app-accent"
          />
          <span>{t('settings.mouseControl')}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isTouchControlEnabled}
            onChange={(e) => setIsTouchControlEnabled(e.target.checked)}
            className="size-4 accent-app-accent"
          />
          <span>{t('settings.touchControl')}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isMidiControlEnabled}
            onChange={(e) => setIsMidiControlEnabled(e.target.checked)}
            className="size-4 accent-app-accent"
          />
          <span>{t('settings.midiControl')}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPianoInputEnabled}
            onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
            className="size-4 accent-app-accent"
          />
          <span>{t('settings.pianoInput')}</span>
        </label>
      </div>

      {isKeyboardControlEnabled && (
        <p className="text-sm text-app-muted dark:text-app-muted-dark">
          {t('settings.keyboard.hint')}
        </p>
      )}

      {isMidiControlEnabled && (
        <div className="text-sm text-app-muted dark:text-app-muted-dark">
          {midiStatusMessageKey && <p>{t(midiStatusMessageKey)}</p>}
          {midiControl.devices.length > 0 && (
            <label className="flex flex-col gap-1 text-center">
              <span>{t('settings.midi.inputDevice')}</span>
              <ControlSelect
                value={selectedDeviceId}
                onChange={(e) => onSelectedMidiInputIdChange(e.target.value)}
              >
                {midiControl.devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {getMidiDeviceName(device)}
                  </option>
                ))}
              </ControlSelect>
            </label>
          )}
        </div>
      )}
    </ControlPanel>
  );
}

export default SettingsPanel;
