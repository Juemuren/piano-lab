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
    <label className="grid grid-cols-[1rem_1fr_1rem] items-center gap-1 rounded-xl bg-app-overlay/15 px-2 py-1 dark:bg-app-overlay-dark/15">
      <span className="font-bold">{label}</span>
      <input
        className="min-w-0 rounded-xl border border-app-border bg-app-mantle p-1 text-center dark:border-app-border-dark dark:bg-app-mantle-dark"
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
