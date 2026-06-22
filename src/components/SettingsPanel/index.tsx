import { useAppSettings } from '../../contexts/appSettings';
import { useMidiControlContext } from '../../contexts/midiControl';
import usePianoInputSettings from '../../hooks/settings/usePianoInputSettings';
import ControlPanel from '../shared/ControlPanel';
import KeyboardControlSettings from './KeyboardControlSettings';
import MidiControlSettings from './MidiControlSettings';
import PianoInputSettingsControl from './PianoInputSettingsControl';
import PointerControlSettings from './PointerControlSettings';
import SynthRecorderSettings from './SynthRecorderSettings';

function SettingsPanel() {
  const { midiControl, selectedMidiInputId, setSelectedMidiInputId } =
    useMidiControlContext();
  const { updatePianoInputSettings, resetPianoInputSettings, clearScoreBody } =
    usePianoInputSettings();
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
    keyboardNoteMappings,
    keyboardOctaveKeyMappings,
    keyboardTemporaryOctaveKeyMappings,
    setKeyboardNoteMappings,
    setKeyboardOctaveKeyMappings,
    setKeyboardTemporaryOctaveKeyMappings,
    isMouseControlEnabled,
    setIsMouseControlEnabled,
    isTouchControlEnabled,
    setIsTouchControlEnabled,
    isMidiControlEnabled,
    setIsMidiControlEnabled,
  } = useAppSettings();

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
        keyboardNoteMappings={keyboardNoteMappings}
        keyboardOctaveKeyMappings={keyboardOctaveKeyMappings}
        keyboardTemporaryOctaveKeyMappings={keyboardTemporaryOctaveKeyMappings}
        setIsKeyboardControlEnabled={setIsKeyboardControlEnabled}
        setIsKeyboardKeyHintEnabled={setIsKeyboardKeyHintEnabled}
        setIsKeyboardOctaveHintEnabled={setIsKeyboardOctaveHintEnabled}
        setKeyboardNoteMappings={setKeyboardNoteMappings}
        setKeyboardOctaveKeyMappings={setKeyboardOctaveKeyMappings}
        setKeyboardTemporaryOctaveKeyMappings={
          setKeyboardTemporaryOctaveKeyMappings
        }
      />
      <MidiControlSettings
        isMidiControlEnabled={isMidiControlEnabled}
        midiControl={midiControl}
        selectedMidiInputId={selectedMidiInputId}
        setIsMidiControlEnabled={setIsMidiControlEnabled}
        setSelectedMidiInputId={setSelectedMidiInputId}
      />
      <PianoInputSettingsControl
        isPianoInputEnabled={isPianoInputEnabled}
        onPianoInputSettingsChange={updatePianoInputSettings}
        onPianoInputSettingsReset={resetPianoInputSettings}
        onScoreBodyClear={clearScoreBody}
        pianoInputSettings={pianoInputSettings}
        setIsPianoInputEnabled={setIsPianoInputEnabled}
      />
      <SynthRecorderSettings />
    </ControlPanel>
  );
}

export default SettingsPanel;
