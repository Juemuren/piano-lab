import { X } from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';
import { getKeyboardControlKeyLabel } from '../../utils/keyboard';

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
        grid grid-cols-[1rem_1fr_1rem] items-center gap-1 py-1 px-2
        rounded-xl bg-app-overlay/15 dark:bg-app-overlay-dark/15
      "
    >
      <span className="font-bold">{label}</span>
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
      <button
        className="m-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!keyValue}
        onClick={onClear}
        title={keyValue}
        type="button"
      >
        <X size={16} />
      </button>
    </label>
  );
}

export default KeyboardMappingInput;
