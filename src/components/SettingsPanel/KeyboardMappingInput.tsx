import { X } from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';
import { getKeyboardControlKeyLabel } from '../../utils/keyboard';
import ControlButton from '../shared/ControlButton';

interface KeyboardMappingInputProps {
  keyValue: string;
  label: ReactNode;
  onClear: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

function KeyboardMappingInput({
  keyValue,
  label,
  onClear,
  onKeyDown,
  placeholder,
}: KeyboardMappingInputProps) {
  return (
    <label
      className="
        grid grid-cols-[1rem_1fr_2rem] items-center gap-2 py-1 px-3
        rounded-xl bg-app-overlay/15 dark:bg-app-overlay-dark/15
      "
    >
      <span className="text-sm font-bold">{label}</span>
      <input
        className="
          min-w-0 text-center p-1
          rounded-xl bg-app-mantle dark:bg-app-mantle-dark
          border border-app-border dark:border-app-border-dark
        "
        id={keyValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly
        value={keyValue ? getKeyboardControlKeyLabel(keyValue) : ''}
      />
      <ControlButton
        disabled={!keyValue}
        icon={<X size={16} />}
        onClick={onClear}
        title={keyValue}
      />
    </label>
  );
}

export default KeyboardMappingInput;
