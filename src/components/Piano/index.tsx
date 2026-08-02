import usePianoControl from '../../hooks/piano/usePianoControl';
import KeyboardOctaveMark from '../shared/KeyboardOctaveMark';
import GamepadControlHints from './GamepadControlHints';
import GamepadNoteIndicators from './GamepadNoteIndicators';
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
                <GamepadNoteIndicators
                  gamepadNotes={gamepadNotes}
                  note={key.note}
                />
                <span className="flex h-full flex-col items-center justify-end py-2">
                  <kbd className="text-piano-black">
                    {keyHints.get(key.note)}
                  </kbd>
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
                <GamepadNoteIndicators
                  gamepadNotes={gamepadNotes}
                  note={key.note}
                />
                <span className="flex h-full flex-col items-center justify-end py-2">
                  <kbd className="text-piano-white">
                    {keyHints.get(key.note)}
                  </kbd>
                </span>
              </PianoKey>
            ))}
          </div>
        </div>
      </div>

      {isGamepadControlEnabled && isGamepadKeyHintEnabled && (
        <GamepadControlHints />
      )}

      {octaveHints.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 text-app-overlay text-sm dark:text-app-overlay-dark">
          {octaveHints.map(({ downKey, type, upKey }) => (
            <span className="flex items-center gap-2" key={type}>
              {downKey && (
                <span>
                  <KeyboardOctaveMark direction="downKey" type={type} />
                  <kbd>{downKey.toUpperCase()}</kbd>
                </span>
              )}
              {upKey && (
                <span>
                  <KeyboardOctaveMark direction="upKey" type={type} />
                  <kbd>{upKey.toUpperCase()}</kbd>
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default Piano;
