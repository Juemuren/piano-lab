import { Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  GamepadControlState,
  GamepadDevice,
  GamepadStatus,
} from '../../stores/pianoDevicesStore';
import ControlCheckbox from '../shared/ControlCheckbox';
import ControlSelect from '../shared/ControlSelect';

interface GamepadControlSettingsProps {
  gamepadControl: GamepadControlState;
  isGamepadControlEnabled: boolean;
  selectedGamepadIndex?: number;
  setIsGamepadControlEnabled: (enabled: boolean) => void;
  setSelectedGamepadIndex: (index?: number) => void;
}

function getGamepadStatusMessageKey(
  status: GamepadStatus,
  deviceCount: number,
) {
  if (status === 'unsupported') {
    return 'settings.gamepad.status.unsupported';
  }
  if (status === 'error') {
    return 'settings.gamepad.status.error';
  }
  if (status === 'ready' && deviceCount === 0) {
    return 'settings.gamepad.status.noDevices';
  }
  return '';
}

function getGamepadDeviceName(device: GamepadDevice) {
  return `${device.index + 1}. ${device.id}`;
}

function GamepadControlSettings({
  gamepadControl,
  isGamepadControlEnabled,
  selectedGamepadIndex,
  setIsGamepadControlEnabled,
  setSelectedGamepadIndex,
}: GamepadControlSettingsProps) {
  const { t } = useTranslation('app');
  const gamepadStatusMessageKey = getGamepadStatusMessageKey(
    gamepadControl.status,
    gamepadControl.devices.length,
  );
  const selectedDevice =
    gamepadControl.devices.find(
      (device) => device.index === selectedGamepadIndex,
    ) ||
    gamepadControl.devices.find(
      (device) => device.index === gamepadControl.activeGamepadIndex,
    ) ||
    gamepadControl.devices.find((device) => device.mapping === 'standard') ||
    gamepadControl.devices[0];

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        checked={isGamepadControlEnabled}
        icon={<Gamepad2 size={16} />}
        label={t('settings.gamepadControl')}
        onChange={(e) => setIsGamepadControlEnabled(e.target.checked)}
      />
      {isGamepadControlEnabled && (
        <div className="flex flex-col gap-1 text-app-overlay text-sm dark:text-app-overlay-dark">
          {gamepadStatusMessageKey && <p>{t(gamepadStatusMessageKey)}</p>}
          {gamepadControl.devices.length > 0 && (
            <>
              <ControlSelect
                label={t('settings.gamepad.inputDevice')}
                onChange={(e) =>
                  setSelectedGamepadIndex(Number(e.target.value))
                }
                value={selectedDevice?.index}
              >
                {gamepadControl.devices.map((device) => (
                  <option key={device.index} value={device.index}>
                    {getGamepadDeviceName(device)}
                  </option>
                ))}
              </ControlSelect>
              {selectedDevice && (
                <p className="text-center">
                  {t('settings.gamepad.deviceInfo', {
                    axes: selectedDevice.axisCount,
                    buttons: selectedDevice.buttonCount,
                  })}
                </p>
              )}
              {selectedDevice?.mapping !== 'standard' && (
                <p>{t('settings.gamepad.status.unsupportedMapping')}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GamepadControlSettings;
