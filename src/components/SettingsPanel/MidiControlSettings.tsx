import { useTranslation } from 'react-i18next';
import type {
  MidiControlState,
  MidiInputDevice,
  MidiStatus,
} from '../../types';
import ControlCheckbox from '../shared/ControlCheckbox';
import ControlSelect from '../shared/ControlSelect';

type MidiControlSettingsProps = {
  isMidiControlEnabled: boolean;
  setIsMidiControlEnabled: (enabled: boolean) => void;
  midiControl: MidiControlState;
  selectedMidiInputId: string;
  setSelectedMidiInputId: (id: string) => void;
};

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

function MidiControlSettings({
  isMidiControlEnabled,
  setIsMidiControlEnabled,
  midiControl,
  selectedMidiInputId,
  setSelectedMidiInputId,
}: MidiControlSettingsProps) {
  const { t } = useTranslation('app');
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
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        label={t('settings.midiControl')}
        checked={isMidiControlEnabled}
        onChange={(e) => setIsMidiControlEnabled(e.target.checked)}
      />
      {isMidiControlEnabled && (
        <div className="flex flex-col gap-1 text-sm text-app-overlay dark:text-app-overlay-dark">
          {midiStatusMessageKey && <p>{t(midiStatusMessageKey)}</p>}
          {midiControl.devices.length > 0 && (
            <ControlSelect
              label={t('settings.midi.inputDevice')}
              value={selectedDeviceId}
              onChange={(e) => setSelectedMidiInputId(e.target.value)}
            >
              {midiControl.devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {getMidiDeviceName(device)}
                </option>
              ))}
            </ControlSelect>
          )}
        </div>
      )}
    </div>
  );
}

export default MidiControlSettings;
