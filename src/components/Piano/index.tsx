import usePianoControl from '../../hooks/piano/usePianoControl';
import GamepadControlHints from './GamepadControlHints';
import GamepadNoteIndicators from './GamepadNoteIndicators';
import KeyboardKeyHint from './KeyboardKeyHint';
import KeyboardOctaveHints from './KeyboardOctaveHints';
import PianoKey from './PianoKey';

const WHITE_KEY_HEIGHT_PX = 160;
const BLACK_KEY_HEIGHT_PX = 100;
const WHITE_KEY_WIDTH_PX = 30;
const BLACK_KEY_WIDTH_PX = 24;

function Piano() {
  const {
    whiteKeys,
    blackKeys,
    gamepadNotes,
    isGamepadControlEnabled,
    isGamepadKeyHintEnabled,
    isGamepadNoteIndicatorEnabled,
    isKeyboardControlEnabled,
    isKeyboardKeyHintEnabled,
    isKeyboardOctaveHintEnabled,
    keyHints,
    octaveHints,
    isKeyPressed,
    isMouseControlEnabled,
    handleKeyDown,
    handleKeyUp,
  } = usePianoControl();
  const keyboardWidth = whiteKeys.length * WHITE_KEY_WIDTH_PX;

  return (
    <>
      <div
        className="w-full overflow-x-auto overscroll-x-contain py-8"
        style={{ touchAction: 'pan-x' }}
      >
        <div
          className="relative mx-auto"
          style={{ height: WHITE_KEY_HEIGHT_PX, width: keyboardWidth }}
        >
          <div className="flex">
            {whiteKeys.map((key) => (
              <PianoKey
                className="relative shrink-0 border border-app-accent"
                height={WHITE_KEY_HEIGHT_PX}
                isMouseControlEnabled={isMouseControlEnabled}
                isPressed={isKeyPressed(key.note)}
                key={key.note}
                normalClassName="bg-piano-white text-piano-black"
                note={key.note}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                pressedClassName="bg-piano-white-active text-piano-black shadow-inner"
                width={WHITE_KEY_WIDTH_PX}
              >
                {isGamepadNoteIndicatorEnabled && (
                  <GamepadNoteIndicators
                    gamepadNotes={gamepadNotes}
                    note={key.note}
                  />
                )}
                <span className="flex h-full flex-col items-center justify-end py-2">
                  {isKeyboardControlEnabled && isKeyboardKeyHintEnabled && (
                    <KeyboardKeyHint
                      className="text-piano-black"
                      keyHints={keyHints}
                      note={key.note}
                    />
                  )}
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
                className="border-none"
                height={BLACK_KEY_HEIGHT_PX}
                isMouseControlEnabled={isMouseControlEnabled}
                isPressed={isKeyPressed(key.note)}
                key={key.note}
                normalClassName="bg-piano-black text-piano-white"
                note={key.note}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                pressedClassName="bg-piano-black-active text-piano-white shadow-inner"
                style={{
                  left:
                    key.position * WHITE_KEY_WIDTH_PX - BLACK_KEY_WIDTH_PX / 2,
                  position: 'absolute',
                  zIndex: 1,
                }}
                width={BLACK_KEY_WIDTH_PX}
              >
                {isGamepadNoteIndicatorEnabled && (
                  <GamepadNoteIndicators
                    gamepadNotes={gamepadNotes}
                    note={key.note}
                  />
                )}
                <span className="flex h-full flex-col items-center justify-end py-2">
                  {isKeyboardControlEnabled && isKeyboardKeyHintEnabled && (
                    <KeyboardKeyHint
                      className="text-piano-white"
                      keyHints={keyHints}
                      note={key.note}
                    />
                  )}
                </span>
              </PianoKey>
            ))}
          </div>
        </div>
      </div>

      {isGamepadControlEnabled && isGamepadKeyHintEnabled && (
        <GamepadControlHints />
      )}

      {isKeyboardControlEnabled && isKeyboardOctaveHintEnabled && (
        <KeyboardOctaveHints octaveHints={octaveHints} />
      )}
    </>
  );
}

export default Piano;
