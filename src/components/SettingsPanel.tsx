import { useTranslation } from 'react-i18next';
import { useAppSettings } from '../contexts/useAppSettings';
import type {
  MidiControlState,
  MidiInputDevice,
  MidiStatus,
} from '../hooks/piano/useMidiControl';
import ControlPanel from './shared/ControlPanel';

interface SettingsPanelProps {
  midiControl: MidiControlState;
}

function getMidiStatusMessageKey(status: MidiStatus, deviceCount: number) {
  if (status === 'unsupported') {
    return 'settings.midiStatus.unsupported';
  }
  if (status === 'requesting') {
    return 'settings.midiStatus.requesting';
  }
  if (status === 'error') {
    return 'settings.midiStatus.error';
  }
  if (deviceCount === 0) {
    return 'settings.midiStatus.noDevices';
  }
  return 'settings.midiStatus.ready';
}

function getMidiDeviceName(device: MidiInputDevice) {
  if (!device.manufacturer) {
    return device.name;
  }
  return `${device.manufacturer} ${device.name}`;
}

function SettingsPanel({ midiControl }: SettingsPanelProps) {
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

      {isMidiControlEnabled && (
        <div className="text-sm text-app-muted dark:text-app-muted-dark">
          <p>{t(midiStatusMessageKey)}</p>
          {midiControl.devices.length > 0 && (
            <ul className="mt-2 space-y-1">
              {midiControl.devices.map((device) => (
                <li key={device.id}>
                  <span className="font-medium text-app-text dark:text-app-text-dark">
                    {getMidiDeviceName(device)}
                  </span>
                  <span> {t(`settings.midiDeviceState.${device.state}`)}</span>
                  <span>
                    {' '}
                    {t(`settings.midiDeviceConnection.${device.connection}`)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </ControlPanel>
  );
}

export default SettingsPanel;
