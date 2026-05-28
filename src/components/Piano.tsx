import { AudioEngine } from '../services/audio/AudioEngine';
import usePianoControl from '../hooks/usePianoControl';

const WHITE_KEY_HEIGHT_PX = 160;
const BLACK_KEY_HEIGHT_PX = 100;
const WHITE_KEY_WIDTH_PX = 30;
const BLACK_KEY_WIDTH_PX = 24;

interface PianoProps {
  audioEngine: AudioEngine;
  playingNotes?: Set<number>;
}

function Piano({ audioEngine, playingNotes = new Set() }: PianoProps) {
  const { whiteKeys, blackKeys, isKeyPressed, handleKeyDown, handleKeyUp } =
    usePianoControl(audioEngine, playingNotes);

  return (
    <div className="w-full pb-10">
      <div
        className="relative inline-block"
        style={{ height: WHITE_KEY_HEIGHT_PX }}
      >
        <div className="flex">
          {whiteKeys.map((key) => {
            const isPressed = isKeyPressed(key.note);
            return (
              <button
                key={key.note}
                onMouseDown={(e) => handleKeyDown(e, key.note)}
                onMouseUp={(e) => handleKeyUp(e, key.note)}
                onMouseLeave={(e) => handleKeyUp(e, key.note)}
                onTouchStart={(e) => handleKeyDown(e, key.note)}
                onTouchEnd={(e) => handleKeyUp(e, key.note)}
                onTouchCancel={(e) => handleKeyUp(e, key.note)}
                className={`
                  text-xs border border-app-accent transition-all duration-100 ${
                    isPressed
                      ? 'bg-piano-white-active text-piano-black shadow-inner'
                      : 'bg-piano-white text-piano-black'
                  }`}
                style={{
                  width: WHITE_KEY_WIDTH_PX,
                  height: WHITE_KEY_HEIGHT_PX,
                  transform: isPressed ? 'translateY(2px)' : 'translateY(0px)',
                }}
              >
                <span className="flex flex-col items-center justify-end h-full pb-2">
                  <span>
                    {key.char}
                    <sub>{key.number}</sub>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex absolute top-0 left-0">
          {blackKeys.map((key) => {
            const isPressed = isKeyPressed(key.note);
            return (
              <button
                key={key.note}
                onMouseDown={(e) => handleKeyDown(e, key.note)}
                onMouseUp={(e) => handleKeyUp(e, key.note)}
                onMouseLeave={(e) => handleKeyUp(e, key.note)}
                onTouchStart={(e) => handleKeyDown(e, key.note)}
                onTouchEnd={(e) => handleKeyUp(e, key.note)}
                onTouchCancel={(e) => handleKeyUp(e, key.note)}
                className={`
                  text-xs border-none transition-all duration-100 ${
                    isPressed
                      ? 'bg-piano-black-active text-piano-white shadow-inner'
                      : 'bg-piano-black text-piano-white'
                  }`}
                style={{
                  width: BLACK_KEY_WIDTH_PX,
                  height: BLACK_KEY_HEIGHT_PX,
                  position: 'absolute',
                  left:
                    key.position * WHITE_KEY_WIDTH_PX - BLACK_KEY_WIDTH_PX / 2,
                  transform: isPressed ? 'translateY(2px)' : 'translateY(0px)',
                  zIndex: 1,
                }}
              ></button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Piano;
