import { useAppSettings } from '../../contexts/appSettings';
import { useMidiControlContext } from '../../contexts/midiControl';
import usePianoInputSettings from '../../hooks/settings/usePianoInputSettings';
import ControlPanel from '../shared/ControlPanel';
import GamepadControlSettings from './GamepadControlSettings';
import KeyboardControlSettings from './KeyboardControlSettings';
import MidiControlSettings from './MidiControlSettings';
import PianoInputSettingsControl from './PianoInputSettingsControl';
import PointerControlSettings from './PointerControlSettings';
import SynthRecorderSettings from './SynthRecorderSettings';

function SettingsPanel() {
  const { midiControl, selectedMidiInputId, setSelectedMidiInputId } =
    useMidiControlContext();
  const {
    syncPianoInputSettings,
    updatePianoInputSettings,
    resetPianoInputSettings,
    clearScoreBody,
  } = usePianoInputSettings();
  const {
    isPianoInputEnabled,
    setIsPianoInputEnabled,
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
    setIsGamepadControlEnabled,
  } = useAppSettings();
  const handlePianoInputEnabledChange = (enabled: boolean) => {
    setIsPianoInputEnabled(enabled);
    if (enabled) {
      syncPianoInputSettings();
    }
  };

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
        isGamepadControlEnabled={isGamepadControlEnabled}
        setIsGamepadControlEnabled={setIsGamepadControlEnabled}
      />
      <PianoInputSettingsControl
        isPianoInputEnabled={isPianoInputEnabled}
        onPianoInputEnabledChange={handlePianoInputEnabledChange}
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
