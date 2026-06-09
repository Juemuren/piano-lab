import { useEffect } from 'react';
import { useMidiControlContext } from '../../contexts/midiControl';
import { usePlayingNotes } from '../../contexts/playingNotes';
import usePianoControl from '../../hooks/piano/usePianoControl';
import PianoKey from './PianoKey';

const WHITE_KEY_HEIGHT_PX = 160;
const BLACK_KEY_HEIGHT_PX = 100;
const WHITE_KEY_WIDTH_PX = 30;
const BLACK_KEY_WIDTH_PX = 24;

function Piano() {
  const { selectedMidiInputId, setMidiControl } = useMidiControlContext();
  const { playingNotes } = usePlayingNotes();
  const {
    whiteKeys,
    blackKeys,
    keyHints,
    isKeyPressed,
    midiControl,
    isMouseControlEnabled,
    handleKeyDown,
    handleKeyUp,
  } = usePianoControl(playingNotes, selectedMidiInputId);
  const keyboardWidth = whiteKeys.length * WHITE_KEY_WIDTH_PX;

  useEffect(() => {
    setMidiControl(midiControl);
  }, [midiControl, setMidiControl]);

  return (
    <div
      className="w-full overflow-x-auto overscroll-x-contain py-4"
      style={{ touchAction: 'pan-x' }}
    >
      <div
        className="relative mx-auto"
        style={{ width: keyboardWidth, height: WHITE_KEY_HEIGHT_PX }}
      >
        <div className="flex">
          {whiteKeys.map((key) => (
            <PianoKey
              key={key.note}
              note={key.note}
              isPressed={isKeyPressed(key.note)}
              isMouseControlEnabled={isMouseControlEnabled}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className="shrink-0 border border-app-accent"
              normalClassName="bg-piano-white text-piano-black"
              pressedClassName="bg-piano-white-active text-piano-black shadow-inner"
              width={WHITE_KEY_WIDTH_PX}
              height={WHITE_KEY_HEIGHT_PX}
            >
              <span className="h-full flex flex-col items-center justify-end py-2">
                <span className="text-piano-black">
                  {keyHints.get(key.note)}
                </span>
                <span>
                  {key.char}
                  <sub>{key.number}</sub>
                </span>
              </span>
            </PianoKey>
          ))}
        </div>

        <div className="absolute top-0 left-0">
          {blackKeys.map((key) => (
            <PianoKey
              key={key.note}
              note={key.note}
              isPressed={isKeyPressed(key.note)}
              isMouseControlEnabled={isMouseControlEnabled}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className="border-none"
              normalClassName="bg-piano-black text-piano-white"
              pressedClassName="bg-piano-black-active text-piano-white shadow-inner"
              width={BLACK_KEY_WIDTH_PX}
              height={BLACK_KEY_HEIGHT_PX}
              style={{
                position: 'absolute',
                left:
                  key.position * WHITE_KEY_WIDTH_PX - BLACK_KEY_WIDTH_PX / 2,
                zIndex: 1,
              }}
            >
              <span className="h-full flex flex-col items-center justify-end py-2">
                <span className="font-semibold text-piano-white">
                  {keyHints.get(key.note)}
                </span>
              </span>
            </PianoKey>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Piano;
