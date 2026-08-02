import { useTranslation } from 'react-i18next';
import type { KeyboardOctaveHint } from '../../hooks/piano/useKeyboardControl';

const KEYBOARD_OCTAVE_LABEL_KEYS = {
  octave: {
    downKey: 'octaveDown',
    upKey: 'octaveUp',
  },
  temporaryOctave: {
    downKey: 'temporaryOctaveDown',
    upKey: 'temporaryOctaveUp',
  },
};

interface KeyboardOctaveHintsProps {
  octaveHints: KeyboardOctaveHint[];
}

function KeyboardOctaveHints({ octaveHints }: KeyboardOctaveHintsProps) {
  const { t } = useTranslation('app');

  if (octaveHints.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto grid w-fit grid-cols-2 gap-4 text-center text-app-overlay text-sm dark:text-app-overlay-dark">
      {octaveHints.flatMap(({ downKey, type, upKey }) =>
        [
          { direction: 'downKey' as const, key: downKey },
          { direction: 'upKey' as const, key: upKey },
        ].map(({ direction, key }) => (
          <span
            className="grid grid-cols-[auto_1fr] items-center gap-2"
            key={`${type}-${direction}`}
          >
            {key && (
              <>
                <kbd>{key.toUpperCase()}</kbd>
                <span>
                  {t(
                    `settings.keyboard.hints.${KEYBOARD_OCTAVE_LABEL_KEYS[type][direction]}`,
                  )}
                </span>
              </>
            )}
          </span>
        )),
      )}
    </div>
  );
}

export default KeyboardOctaveHints;
