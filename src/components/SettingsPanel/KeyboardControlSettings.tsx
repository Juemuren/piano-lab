import { Eraser, Keyboard, RotateCcw, X } from 'lucide-react';
import type { Dispatch, KeyboardEvent, ReactNode, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import type { KeyboardControlMappings } from '../../constants/keyboard';
import useKeyboardControlSettings from '../../hooks/settings/useKeyboardControlSettings';
import { NOTE_NAMES } from '../../utils/pitch';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';

const KEYBOARD_OCTAVE_DIRECTIONS = ['upKey', 'downKey'] as const;
const KEYBOARD_OCTAVE_MARKS = {
  octave: {
    downKey: '⇓',
    upKey: '⇑',
  },
  temporaryOctave: {
    downKey: '↓',
    upKey: '↑',
  },
};

interface KeyboardControlSettingsProps {
  isKeyboardControlEnabled: boolean;
  isKeyboardKeyHintEnabled: boolean;
  isKeyboardOctaveHintEnabled: boolean;
  keyboardControlMappings: KeyboardControlMappings;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setIsKeyboardKeyHintEnabled: (enabled: boolean) => void;
  setIsKeyboardOctaveHintEnabled: (enabled: boolean) => void;
  setKeyboardControlMappings: Dispatch<SetStateAction<KeyboardControlMappings>>;
}

function getOffsetLabel(offset: number) {
  const noteName =
    NOTE_NAMES[
      ((offset % NOTE_NAMES.length) + NOTE_NAMES.length) % NOTE_NAMES.length
    ];
  const accidental = noteName.endsWith('#') ? '#' : '';
  const naturalName = accidental ? noteName.slice(0, -1) : noteName;
  const octaveMark = offset < 0 ? '-' : offset >= NOTE_NAMES.length ? '+' : '';

  return (
    <span>
      {naturalName}
      {accidental && octaveMark ? (
        <span>
          <sup>{accidental}</sup>
          <sub className="ml-[-1ch]">{octaveMark}</sub>
        </span>
      ) : (
        <span>
          {accidental && <sup>{accidental}</sup>}
          {octaveMark && <sub>{octaveMark}</sub>}
        </span>
      )}
    </span>
  );
}

function KeyboardControlSettings({
  isKeyboardControlEnabled,
  isKeyboardKeyHintEnabled,
  isKeyboardOctaveHintEnabled,
  setIsKeyboardControlEnabled,
  setIsKeyboardKeyHintEnabled,
  setIsKeyboardOctaveHintEnabled,
  keyboardControlMappings,
  setKeyboardControlMappings,
}: KeyboardControlSettingsProps) {
  const { t } = useTranslation('app');
  const {
    clearKeyboardMappings,
    handleMappingKeyDown,
    resetKeyboardMappings,
    setMappingKey,
  } = useKeyboardControlSettings({
    setKeyboardControlMappings,
  });
  const { noteMappings, octaveKeyMappings, temporaryOctaveKeyMappings } =
    keyboardControlMappings;
  const emptyKeyboardMappingText = t('settings.keyboard.empty');

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        checked={isKeyboardControlEnabled}
        icon={<Keyboard size={16} />}
        label={t('settings.keyboardControl')}
        onChange={(e) => setIsKeyboardControlEnabled(e.target.checked)}
      />
      {isKeyboardControlEnabled && (
        <>
          <p className="text-app-overlay text-sm dark:text-app-overlay-dark">
            {t('settings.keyboard.hint')}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <ControlCheckbox
              checked={isKeyboardKeyHintEnabled}
              label={t('settings.keyboard.keyHint')}
              labelClassName="text-app-subtext dark:text-app-subtext-dark"
              onChange={(e) => setIsKeyboardKeyHintEnabled(e.target.checked)}
            />
            <ControlCheckbox
              checked={isKeyboardOctaveHintEnabled}
              label={t('settings.keyboard.octaveHint')}
              labelClassName="text-app-subtext dark:text-app-subtext-dark"
              onChange={(e) => setIsKeyboardOctaveHintEnabled(e.target.checked)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm xl:grid-cols-4">
            {noteMappings.map(({ offset, key }) => (
              <KeyboardMappingInput
                id={offset.toString()}
                key={offset}
                keyValue={key}
                label={getOffsetLabel(offset)}
                onClear={() => setMappingKey({ offset, type: 'note' }, '')}
                onKeyDown={(e) =>
                  handleMappingKeyDown({ offset, type: 'note' }, e)
                }
                placeholder={emptyKeyboardMappingText}
              />
            ))}
            {KEYBOARD_OCTAVE_DIRECTIONS.map((direction) => (
              <KeyboardMappingInput
                id={direction}
                key={direction}
                keyValue={octaveKeyMappings[direction]}
                label={KEYBOARD_OCTAVE_MARKS.octave[direction]}
                onClear={() => setMappingKey({ direction, type: 'octave' }, '')}
                onKeyDown={(e) =>
                  handleMappingKeyDown({ direction, type: 'octave' }, e)
                }
                placeholder={emptyKeyboardMappingText}
              />
            ))}
            {KEYBOARD_OCTAVE_DIRECTIONS.map((direction) => (
              <KeyboardMappingInput
                id={`temporary-${direction}`}
                key={`temporary-${direction}`}
                keyValue={temporaryOctaveKeyMappings[direction]}
                label={KEYBOARD_OCTAVE_MARKS.temporaryOctave[direction]}
                onClear={() =>
                  setMappingKey({ direction, type: 'temporaryOctave' }, '')
                }
                onKeyDown={(e) =>
                  handleMappingKeyDown(
                    { direction, type: 'temporaryOctave' },
                    e,
                  )
                }
                placeholder={emptyKeyboardMappingText}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <ControlButton
              bgClassName="bg-app-warning/15 hover:bg-app-warning/25 dark:bg-app-warning-dark/15 dark:hover:bg-app-warning-dark/25"
              colorClassName="text-app-warning dark:text-app-warning-dark"
              icon={<RotateCcw size={16} />}
              label={t('settings.keyboard.reset')}
              onClick={resetKeyboardMappings}
            />
            <ControlButton
              bgClassName="bg-app-error/15 hover:bg-app-error/25 dark:bg-app-error-dark/15 dark:hover:bg-app-error-dark/25"
              colorClassName="text-app-error dark:text-app-error-dark"
              icon={<Eraser size={16} />}
              label={t('settings.keyboard.clear')}
              onClick={clearKeyboardMappings}
            />
          </div>
        </>
      )}
    </div>
  );
}

interface KeyboardMappingInputProps {
  id: string;
  keyValue: string;
  label: ReactNode;
  onClear: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

function KeyboardMappingInput({
  id,
  keyValue,
  label,
  onClear,
  onKeyDown,
  placeholder,
}: KeyboardMappingInputProps) {
  return (
    <label className="grid grid-cols-[1rem_1fr_1rem] items-center gap-1 rounded-xl bg-app-overlay/15 px-2 py-1 dark:bg-app-overlay-dark/15">
      <span className="font-bold">{label}</span>
      <input
        className="min-w-0 rounded-xl bg-app-mantle p-1 text-center dark:bg-app-mantle-dark"
        id={id}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly
        value={keyValue.toUpperCase()}
      />
      <button
        className="m-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!keyValue}
        onClick={onClear}
        title={id}
        type="button"
      >
        <X size={16} strokeWidth={4} />
      </button>
    </label>
  );
}

export default KeyboardControlSettings;
