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

type BooleanSettingChangeHandler = (enabled: boolean) => void;

type KeyboardControlSettingsProps = {
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: BooleanSettingChangeHandler;
};

type PointerControlSettingsProps = {
  isMouseControlEnabled: boolean;
  setIsMouseControlEnabled: BooleanSettingChangeHandler;
  isTouchControlEnabled: boolean;
  setIsTouchControlEnabled: BooleanSettingChangeHandler;
};

type PianoInputSettingsControlProps = {
  isPianoInputEnabled: boolean;
  setIsPianoInputEnabled: BooleanSettingChangeHandler;
  pianoInputSettings: PianoInputSettings;
  onPianoInputSettingsChange: (settings: Partial<PianoInputSettings>) => void;
};

type MidiControlSettingsProps = {
  isMidiControlEnabled: boolean;
  setIsMidiControlEnabled: BooleanSettingChangeHandler;
  midiStatusMessageKey: string;
  devices: MidiInputDevice[];
  selectedDeviceId: string;
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

function KeyboardControlSettings({
  isKeyboardControlEnabled,
  setIsKeyboardControlEnabled,
}: KeyboardControlSettingsProps) {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        label={t('settings.keyboardControl')}
        checked={isKeyboardControlEnabled}
        onChange={(e) => setIsKeyboardControlEnabled(e.target.checked)}
      />
      {isKeyboardControlEnabled && (
        <p className="text-sm text-app-muted dark:text-app-muted-dark">
          {t('settings.keyboard.hint')}
        </p>
      )}
    </div>
  );
}

function PointerControlSettings({
  isMouseControlEnabled,
  setIsMouseControlEnabled,
  isTouchControlEnabled,
  setIsTouchControlEnabled,
}: PointerControlSettingsProps) {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-3">
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
    </div>
  );
}

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

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        label={t('settings.pianoInputEnable')}
        checked={isPianoInputEnabled}
        onChange={(e) => setIsPianoInputEnabled(e.target.checked)}
      />
      {isPianoInputEnabled && (
        <>
          <ControlField label={t('settings.pianoInput.defaultNoteLength')}>
            <ControlSelect
              value={pianoInputSettings.defaultNoteLength}
              onChange={(e) =>
                onPianoInputSettingsChange({
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
            onChange={(tempo) => onPianoInputSettingsChange({ tempo })}
          />
          <p className="text-xs text-app-tip/50 dark:text-app-tip-dark/50">
            {t('settings.pianoInput.quarterNoteSeconds', {
              seconds: quarterNoteSeconds,
            })}
          </p>
        </>
      )}
    </div>
  );
}

function MidiControlSettings({
  isMidiControlEnabled,
  setIsMidiControlEnabled,
  midiStatusMessageKey,
  devices,
  selectedDeviceId,
  setSelectedMidiInputId,
}: MidiControlSettingsProps) {
  const { t } = useTranslation('app');

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        label={t('settings.midiControl')}
        checked={isMidiControlEnabled}
        onChange={(e) => setIsMidiControlEnabled(e.target.checked)}
      />
      {isMidiControlEnabled && (
        <div className="text-sm text-app-muted dark:text-app-muted-dark">
          {midiStatusMessageKey && <p>{t(midiStatusMessageKey)}</p>}
          {devices.length > 0 && (
            <ControlField label={t('settings.midi.inputDevice')}>
              <ControlSelect
                value={selectedDeviceId}
                onChange={(e) => setSelectedMidiInputId(e.target.value)}
              >
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {getMidiDeviceName(device)}
                  </option>
                ))}
              </ControlSelect>
            </ControlField>
          )}
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ onPianoInputSettingsChange }: SettingsPanelProps) {
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

  return (
    <ControlPanel className="gap-3 grid grid-cols-1 lg:grid-cols-2">
      <KeyboardControlSettings
        isKeyboardControlEnabled={isKeyboardControlEnabled}
        setIsKeyboardControlEnabled={setIsKeyboardControlEnabled}
      />
      <PointerControlSettings
        isMouseControlEnabled={isMouseControlEnabled}
        setIsMouseControlEnabled={setIsMouseControlEnabled}
        isTouchControlEnabled={isTouchControlEnabled}
        setIsTouchControlEnabled={setIsTouchControlEnabled}
      />
      <MidiControlSettings
        isMidiControlEnabled={isMidiControlEnabled}
        setIsMidiControlEnabled={setIsMidiControlEnabled}
        midiStatusMessageKey={midiStatusMessageKey}
        devices={midiControl.devices}
        selectedDeviceId={selectedDeviceId}
        setSelectedMidiInputId={setSelectedMidiInputId}
      />
      <PianoInputSettingsControl
        isPianoInputEnabled={isPianoInputEnabled}
        setIsPianoInputEnabled={setIsPianoInputEnabled}
        pianoInputSettings={pianoInputSettings}
        onPianoInputSettingsChange={onPianoInputSettingsChange}
      />
    </ControlPanel>
  );
}

export default SettingsPanel;
