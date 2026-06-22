import { Keyboard, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  KeyboardNoteMapping,
  KeyboardOctaveKeyMappings,
} from '../../constants/keyboard';
import useKeyboardControlSettings from '../../hooks/settings/useKeyboardControlSettings';
import { NOTE_NAMES } from '../../utils/pitch';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';
import KeyboardMappingInput from './KeyboardMappingInput';

interface KeyboardControlSettingsProps {
  isKeyboardControlEnabled: boolean;
  keyboardNoteMappings: KeyboardNoteMapping[];
  keyboardOctaveKeyMappings: KeyboardOctaveKeyMappings;
  setIsKeyboardControlEnabled: (enabled: boolean) => void;
  setKeyboardNoteMappings: (mappings: KeyboardNoteMapping[]) => void;
  setKeyboardOctaveKeyMappings: (mappings: KeyboardOctaveKeyMappings) => void;
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

const OCTAVE_KEY_MAPPING_CONTROLS = [
  { direction: 'upKey', label: '⇑' },
  { direction: 'downKey', label: '⇓' },
] as const;

function KeyboardControlSettings({
  isKeyboardControlEnabled,
  setIsKeyboardControlEnabled,
  keyboardNoteMappings,
  keyboardOctaveKeyMappings,
  setKeyboardNoteMappings,
  setKeyboardOctaveKeyMappings,
}: KeyboardControlSettingsProps) {
  const { t } = useTranslation('app');
  const {
    handleNoteKeyDown,
    handleOctaveKeyDown,
    resetKeyboardMappings,
    setNoteMappingKey,
    setOctaveMappingKey,
  } = useKeyboardControlSettings({
    keyboardNoteMappings,
    keyboardOctaveKeyMappings,
    setKeyboardNoteMappings,
    setKeyboardOctaveKeyMappings,
  });
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
          <p className="text-sm text-app-overlay dark:text-app-overlay-dark">
            {t('settings.keyboard.hint')}
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4">
            {keyboardNoteMappings.map(({ offset, key }) => (
              <KeyboardMappingInput
                key={offset}
                keyValue={key}
                label={getOffsetLabel(offset)}
                onClear={() => setNoteMappingKey(offset, '')}
                onKeyDown={(e) => handleNoteKeyDown(offset, e)}
                placeholder={emptyKeyboardMappingText}
              />
            ))}
            {OCTAVE_KEY_MAPPING_CONTROLS.map(({ direction, label }) => (
              <KeyboardMappingInput
                key={direction}
                keyValue={keyboardOctaveKeyMappings[direction]}
                label={label}
                onClear={() => setOctaveMappingKey(direction, '')}
                onKeyDown={(e) => handleOctaveKeyDown(direction, e)}
                placeholder={emptyKeyboardMappingText}
              />
            ))}
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
