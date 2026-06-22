import { Keyboard, RotateCcw, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { KeyboardNoteMapping } from '../../constants/keyboard';
import { DEFAULT_KEYBOARD_NOTE_MAPPINGS } from '../../constants/keyboard';
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
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
}

function getOffsetLabel(offset: number) {
  if (offset === 12) {
    return 'C+';
  }

  return NOTE_NAMES[offset];
}

function KeyboardControlSettings({
  isKeyboardControlEnabled,
  setIsKeyboardControlEnabled,
  keyboardNoteMappings,
  setKeyboardNoteMappings,
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

  function handleKeyDown(offset: number, e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setMappingKey(offset, '');
      return;
    }

    const key = normalizeKeyboardControlKey(e.key);
    if (key === null) {
      return;
    }

    setMappingKey(offset, key);
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
            <ControlButton
              icon={<RotateCcw size={20} />}
              label={t('settings.keyboard.reset')}
              onClick={() =>
                setKeyboardNoteMappings(DEFAULT_KEYBOARD_NOTE_MAPPINGS)
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export default KeyboardControlSettings;
