import usePianoControl from '../hooks/piano/usePianoControl';

const WHITE_KEY_HEIGHT_PX = 160;
const BLACK_KEY_HEIGHT_PX = 100;
const WHITE_KEY_WIDTH_PX = 30;
const BLACK_KEY_WIDTH_PX = 24;

interface PianoProps {
  playingNotes?: Set<number>;
  onNoteInput?: (pitch: number) => void;
}

function Piano({ playingNotes = new Set(), onNoteInput }: PianoProps) {
  const {
    whiteKeys,
    blackKeys,
    keyHints,
    isKeyPressed,
    isMouseControlEnabled,
    handleKeyDown,
    handleKeyUp,
  } = usePianoControl(playingNotes, onNoteInput);
  const keyboardWidth = whiteKeys.length * WHITE_KEY_WIDTH_PX;

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
          {whiteKeys.map((key) => {
            const isPressed = isKeyPressed(key.note);
            const keyHint = keyHints.get(key.note);
            const cursorClass = isMouseControlEnabled
              ? 'cursor-pointer'
              : 'cursor-default';
            return (
              <button
                type="button"
                key={key.note}
                onMouseDown={(e) => handleKeyDown(e, key.note)}
                onMouseUp={(e) => handleKeyUp(e, key.note)}
                onMouseLeave={(e) => handleKeyUp(e, key.note)}
                onTouchStart={(e) => handleKeyDown(e, key.note)}
                onTouchEnd={(e) => handleKeyUp(e, key.note)}
                onTouchCancel={(e) => handleKeyUp(e, key.note)}
                className={`
                  shrink-0 ${cursorClass} text-xs border border-app-accent transition-all duration-100 ${
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
                <span className="h-full flex flex-col items-center justify-end py-2">
                  <span className="text-piano-black">{keyHint}</span>
                  <span>
                    {key.char}
                    <sub>{key.number}</sub>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute top-0 left-0">
          {blackKeys.map((key) => {
            const isPressed = isKeyPressed(key.note);
            const keyHint = keyHints.get(key.note);
            const cursorClass = isMouseControlEnabled
              ? 'cursor-pointer'
              : 'cursor-default';
            return (
              <button
                type="button"
                key={key.note}
                onMouseDown={(e) => handleKeyDown(e, key.note)}
                onMouseUp={(e) => handleKeyUp(e, key.note)}
                onMouseLeave={(e) => handleKeyUp(e, key.note)}
                onTouchStart={(e) => handleKeyDown(e, key.note)}
                onTouchEnd={(e) => handleKeyUp(e, key.note)}
                onTouchCancel={(e) => handleKeyUp(e, key.note)}
                className={`
                  ${cursorClass} text-xs border-none transition-all duration-100 ${
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
              >
                <span className="h-full flex flex-col items-center justify-end py-2">
                  <span className="font-semibold text-piano-white">
                    {keyHint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Piano;
