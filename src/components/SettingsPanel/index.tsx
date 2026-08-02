import usePianoInputSettings from '../../hooks/settings/usePianoInputSettings';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import { usePianoDevicesStore } from '../../stores/pianoDevicesStore';
import ControlPanel from '../shared/ControlPanel';
import GamepadControlSettings from './GamepadControlSettings';
import KeyboardControlSettings from './KeyboardControlSettings';
import MidiControlSettings from './MidiControlSettings';
import PianoInputSettingsControl from './PianoInputSettingsControl';
import PointerControlSettings from './PointerControlSettings';
import SynthRecorderSettings from './SynthRecorderSettings';

function SettingsPanel() {
  const gamepadControl = usePianoDevicesStore((state) => state.gamepadControl);
  const selectedGamepadIndex = usePianoDevicesStore(
    (state) => state.selectedGamepadIndex,
  );
  const setSelectedGamepadIndex = usePianoDevicesStore(
    (state) => state.setSelectedGamepadIndex,
  );
  const midiControl = usePianoDevicesStore((state) => state.midiControl);
  const selectedMidiInputId = usePianoDevicesStore(
    (state) => state.selectedMidiInputId,
  );
  const setSelectedMidiInputId = usePianoDevicesStore(
    (state) => state.setSelectedMidiInputId,
  );
  const {
    updatePianoInputEnabled,
    updatePianoInputSettings,
    resetPianoInputSettings,
    clearScoreBody,
  } = usePianoInputSettings();
  const {
    isPianoInputEnabled,
    pianoInputSettings,
    isKeyboardControlEnabled,
    isKeyboardKeyHintEnabled,
    isKeyboardOctaveHintEnabled,
    setIsKeyboardControlEnabled,
    setIsKeyboardKeyHintEnabled,
    setIsKeyboardOctaveHintEnabled,
    keyboardControlMappings,
    setKeyboardControlMappings,
    isMouseControlEnabled,
    setIsMouseControlEnabled,
    isTouchControlEnabled,
    setIsTouchControlEnabled,
    isMidiControlEnabled,
    setIsMidiControlEnabled,
    isGamepadControlEnabled,
    isGamepadKeyHintEnabled,
    isGamepadNoteIndicatorEnabled,
    setIsGamepadControlEnabled,
    setIsGamepadKeyHintEnabled,
    setIsGamepadNoteIndicatorEnabled,
  } = useAppSettingsStore();
  return (
    <ControlPanel className="flex flex-col gap-3 text-left">
      <PointerControlSettings
        isMouseControlEnabled={isMouseControlEnabled}
        isTouchControlEnabled={isTouchControlEnabled}
        setIsMouseControlEnabled={setIsMouseControlEnabled}
        setIsTouchControlEnabled={setIsTouchControlEnabled}
      />
      <KeyboardControlSettings
        isKeyboardControlEnabled={isKeyboardControlEnabled}
        isKeyboardKeyHintEnabled={isKeyboardKeyHintEnabled}
        isKeyboardOctaveHintEnabled={isKeyboardOctaveHintEnabled}
        keyboardControlMappings={keyboardControlMappings}
        setIsKeyboardControlEnabled={setIsKeyboardControlEnabled}
        setIsKeyboardKeyHintEnabled={setIsKeyboardKeyHintEnabled}
        setIsKeyboardOctaveHintEnabled={setIsKeyboardOctaveHintEnabled}
        setKeyboardControlMappings={setKeyboardControlMappings}
      />
      <MidiControlSettings
        isMidiControlEnabled={isMidiControlEnabled}
        midiControl={midiControl}
        selectedMidiInputId={selectedMidiInputId}
        setIsMidiControlEnabled={setIsMidiControlEnabled}
        setSelectedMidiInputId={setSelectedMidiInputId}
      />
      <GamepadControlSettings
        gamepadControl={gamepadControl}
        isGamepadControlEnabled={isGamepadControlEnabled}
        isGamepadKeyHintEnabled={isGamepadKeyHintEnabled}
        isGamepadNoteIndicatorEnabled={isGamepadNoteIndicatorEnabled}
        selectedGamepadIndex={selectedGamepadIndex}
        setIsGamepadControlEnabled={setIsGamepadControlEnabled}
        setIsGamepadKeyHintEnabled={setIsGamepadKeyHintEnabled}
        setIsGamepadNoteIndicatorEnabled={setIsGamepadNoteIndicatorEnabled}
        setSelectedGamepadIndex={setSelectedGamepadIndex}
      />
      <PianoInputSettingsControl
        isPianoInputEnabled={isPianoInputEnabled}
        onPianoInputEnabledChange={updatePianoInputEnabled}
        onPianoInputSettingsChange={updatePianoInputSettings}
        onPianoInputSettingsReset={resetPianoInputSettings}
        onScoreBodyClear={clearScoreBody}
        pianoInputSettings={pianoInputSettings}
      />
      <SynthRecorderSettings />
    </ControlPanel>
  );
}

export default SettingsPanel;
