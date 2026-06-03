import { useAppSettings } from '../../contexts/appSettings';
import { useMidiControlContext } from '../../contexts/midiControl';
import usePianoInputSettings from '../../hooks/settings/usePianoInputSettings';
import KeyboardControlSettings from './KeyboardControlSettings';
import MidiControlSettings from './MidiControlSettings';
import PianoInputSettingsControl from './PianoInputSettingsControl';
import PointerControlSettings from './PointerControlSettings';
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
    <ControlPanel className="text-left gap-3 grid grid-cols-1 lg:grid-cols-2">
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
    </ControlPanel>
  );
}

export default SettingsPanel;
