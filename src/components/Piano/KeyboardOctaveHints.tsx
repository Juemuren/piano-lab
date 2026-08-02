import type { KeyboardOctaveHint } from '../../hooks/piano/useKeyboardControl';
import KeyboardOctaveMark from '../shared/KeyboardOctaveMark';

interface KeyboardOctaveHintsProps {
  octaveHints: KeyboardOctaveHint[];
}

function KeyboardOctaveHints({ octaveHints }: KeyboardOctaveHintsProps) {
  if (octaveHints.length === 0) {
    return null;
  }

  return (
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
  );
}

export default KeyboardOctaveHints;
