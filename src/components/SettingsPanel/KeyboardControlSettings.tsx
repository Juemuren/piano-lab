import { RotateCcw, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_KEYBOARD_NOTE_MAPPINGS,
  type KeyboardNoteMapping,
} from '../../constants/keyboard';
import {
  getKeyboardControlKeyLabel,
  normalizeKeyboardControlKey,
} from '../../utils/keyboard';
import { NOTE_NAMES } from '../../utils/pitch';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';

type KeyboardControlSettingsProps = {
  isKeyboardControlEnabled: boolean;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  keyboardNoteMappings: KeyboardNoteMapping[];
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
};

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
        label={t('settings.keyboardControl')}
        checked={isKeyboardControlEnabled}
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
                key={offset}
                className="
                    grid grid-cols-[1rem_1fr_2rem] items-center gap-2 p-2
                    rounded-xl bg-app-overlay/15 dark:bg-app-overlay-dark/15
                  "
              >
                <span className="text-sm font-bold">
                  {getOffsetLabel(offset)}
                </span>
                <input
                  className="
                      min-w-0 text-center p-2
                      rounded-xl bg-app-mantle dark:bg-app-mantle-dark
                      border border-app-border dark:border-app-border-dark
                    "
                  readOnly
                  value={key ? getKeyboardControlKeyLabel(key) : ''}
                  placeholder={t('settings.keyboard.empty')}
                  onKeyDown={(e) => handleKeyDown(offset, e)}
                />
                <ControlButton
                  disabled={!key}
                  icon={<X size={16} />}
                  onClick={() => setMappingKey(offset, '')}
                />
              </label>
            ))}
            <ControlButton
              label={t('settings.keyboard.reset')}
              icon={<RotateCcw size={24} />}
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
