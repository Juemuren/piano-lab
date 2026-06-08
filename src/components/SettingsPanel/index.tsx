import { useAppSettings } from '../../contexts/appSettings';
import { useMidiControlContext } from '../../contexts/midiControl';
import usePianoInputSettings from '../../hooks/settings/usePianoInputSettings';
import KeyboardControlSettings from './KeyboardControlSettings';
import MidiControlSettings from './MidiControlSettings';
import PianoInputSettingsControl from './PianoInputSettingsControl';
import PointerControlSettings from './PointerControlSettings';
import SynthRecorderSettings from './SynthRecorderSettings';
import ControlPanel from '../shared/ControlPanel';

function SettingsPanel() {
  const { midiControl, selectedMidiInputId, setSelectedMidiInputId } =
    useMidiControlContext();
  const handlePianoInputSettingsChange = usePianoInputSettings();
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

  return (
    <ControlPanel className="flex flex-col gap-3 text-left">
      <PointerControlSettings
        isMouseControlEnabled={isMouseControlEnabled}
        setIsMouseControlEnabled={setIsMouseControlEnabled}
        isTouchControlEnabled={isTouchControlEnabled}
        setIsTouchControlEnabled={setIsTouchControlEnabled}
      />
      <KeyboardControlSettings
        isKeyboardControlEnabled={isKeyboardControlEnabled}
        setIsKeyboardControlEnabled={setIsKeyboardControlEnabled}
      />
      <MidiControlSettings
        isMidiControlEnabled={isMidiControlEnabled}
        setIsMidiControlEnabled={setIsMidiControlEnabled}
        midiControl={midiControl}
        selectedMidiInputId={selectedMidiInputId}
        setSelectedMidiInputId={setSelectedMidiInputId}
      />
      <PianoInputSettingsControl
        isPianoInputEnabled={isPianoInputEnabled}
        setIsPianoInputEnabled={setIsPianoInputEnabled}
        pianoInputSettings={pianoInputSettings}
        onPianoInputSettingsChange={handlePianoInputSettingsChange}
      />
      <SynthRecorderSettings />
    </ControlPanel>
  );
}

export default SettingsPanel;
