import { Keyboard, RotateCcw, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  DEFAULT_KEYBOARD_OCTAVE_KEY_MAPPINGS,
} from '../../constants/keyboard';
import {
  getKeyboardControlKeyLabel,
  normalizeKeyboardControlKey,
} from '../../utils/keyboard';
import { NOTE_NAMES } from '../../utils/pitch';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';

interface KeyboardControlSettingsProps {
  isKeyboardControlEnabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  keyboardOctaveKeyMappings: KeyboardOctaveKeyMappings;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
  setKeyboardOctaveKeyMappings: (mappings: KeyboardOctaveKeyMappings) => void;
}

type KeyboardOctaveDirection = keyof KeyboardOctaveKeyMappings;

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
  setIsKeyboardControlEnabled,
  keyboardNoteMappings,
  keyboardOctaveKeyMappings,
  setKeyboardNoteMappings,
  setKeyboardOctaveKeyMappings,
}: KeyboardControlSettingsProps) {
  const { t } = useTranslation('app');

  function setMappingKey(offset: number, key: string) {
    setKeyboardNoteMappings(
      keyboardNoteMappings.map((mapping) => {
        if (mapping.offset === offset) {
          return { ...mapping, key };
        }

        if (key && mapping.key === key) {
          return { ...mapping, key: '' };
        }

        return mapping;
      }),
    );
  }

  function setOctaveMappingKey(
    direction: KeyboardOctaveDirection,
    key: string,
  ) {
    setKeyboardOctaveKeyMappings({
      ...keyboardOctaveKeyMappings,
      [direction]: key,
      ...(key &&
      direction === 'downKey' &&
      keyboardOctaveKeyMappings.upKey === key
        ? { upKey: '' }
        : {}),
      ...(key &&
      direction === 'upKey' &&
      keyboardOctaveKeyMappings.downKey === key
        ? { downKey: '' }
        : {}),
    });

    if (!key) {
      return;
    }

    setKeyboardNoteMappings(
      keyboardNoteMappings.map((mapping) => {
        if (mapping.key === key) {
          return { ...mapping, key: '' };
        }

        return mapping;
      }),
    );
  }

  function handleKeyDown(offset: number, e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setMappingKey(offset, '');
      return;
    }

    const key = normalizeKeyboardControlKey(e.key, [
      keyboardOctaveKeyMappings.downKey,
      keyboardOctaveKeyMappings.upKey,
    ]);
    if (key === null) {
      return;
    }

    setMappingKey(offset, key);
  }

  function handleOctaveKeyDown(
    direction: KeyboardOctaveDirection,
    e: KeyboardEvent<HTMLInputElement>,
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setOctaveMappingKey(direction, '');
      return;
    }

    const key = normalizeKeyboardControlKey(e.key);
    if (key === null) {
      return;
    }

    setOctaveMappingKey(direction, key);
  }

  function resetKeyboardMappings() {
    setKeyboardNoteMappings(DEFAULT_KEYBOARD_NOTE_MAPPINGS);
    setKeyboardOctaveKeyMappings(DEFAULT_KEYBOARD_OCTAVE_KEY_MAPPINGS);
  }

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
          <p className="text-sm text-app-overlay dark:text-app-overlay-dark">
            {t('settings.keyboard.hint')}
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
            {keyboardNoteMappings.map(({ offset, key }) => (
              <label
                className="
                  grid grid-cols-[1rem_1fr_2rem] items-center gap-2 py-1 px-3
                  rounded-xl bg-app-overlay/15 dark:bg-app-overlay-dark/15
                "
                key={offset}
              >
                <span className="text-sm font-bold">
                  {getOffsetLabel(offset)}
                </span>
                <input
                  className="
                    min-w-0 text-center p-1
                    rounded-xl bg-app-mantle dark:bg-app-mantle-dark
                    border border-app-border dark:border-app-border-dark
                  "
                  id={key}
                  onKeyDown={(e) => handleKeyDown(offset, e)}
                  placeholder={t('settings.keyboard.empty')}
                  readOnly
                  value={key ? getKeyboardControlKeyLabel(key) : ''}
                />
                <ControlButton
                  disabled={!key}
                  icon={<X size={16} />}
                  onClick={() => setMappingKey(offset, '')}
                  title={key}
                />
              </label>
            ))}
            <label
              className="
                grid grid-cols-[1rem_1fr_2rem] items-center gap-2 py-1 px-3
                rounded-xl bg-app-overlay/15 dark:bg-app-overlay-dark/15
              "
            >
              <span className="text-sm font-bold">⇑</span>
              <input
                className="
                  min-w-0 text-center p-1
                  rounded-xl bg-app-mantle dark:bg-app-mantle-dark
                  border border-app-border dark:border-app-border-dark
                "
                id={keyboardOctaveKeyMappings.upKey}
                onKeyDown={(e) => handleOctaveKeyDown('upKey', e)}
                placeholder={t('settings.keyboard.empty')}
                readOnly
                value={
                  keyboardOctaveKeyMappings.upKey
                    ? getKeyboardControlKeyLabel(
                        keyboardOctaveKeyMappings.upKey,
                      )
                    : ''
                }
              />
              <ControlButton
                disabled={!keyboardOctaveKeyMappings.upKey}
                icon={<X size={16} />}
                onClick={() => setOctaveMappingKey('upKey', '')}
                title={keyboardOctaveKeyMappings.upKey}
              />
            </label>
            <label
              className="
                grid grid-cols-[1rem_1fr_2rem] items-center gap-2 py-1 px-3
                rounded-xl bg-app-overlay/15 dark:bg-app-overlay-dark/15
              "
            >
              <span className="text-sm font-bold">⇓</span>
              <input
                className="
                  min-w-0 text-center p-1
                  rounded-xl bg-app-mantle dark:bg-app-mantle-dark
                  border border-app-border dark:border-app-border-dark
                "
                id={keyboardOctaveKeyMappings.downKey}
                onKeyDown={(e) => handleOctaveKeyDown('downKey', e)}
                placeholder={t('settings.keyboard.empty')}
                readOnly
                value={
                  keyboardOctaveKeyMappings.downKey
                    ? getKeyboardControlKeyLabel(
                        keyboardOctaveKeyMappings.downKey,
                      )
                    : ''
                }
              />
              <ControlButton
                disabled={!keyboardOctaveKeyMappings.downKey}
                icon={<X size={16} />}
                onClick={() => setOctaveMappingKey('downKey', '')}
                title={keyboardOctaveKeyMappings.downKey}
              />
            </label>
            <ControlButton
              icon={<RotateCcw size={20} />}
              label={t('settings.keyboard.reset')}
              onClick={resetKeyboardMappings}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default KeyboardControlSettings;
