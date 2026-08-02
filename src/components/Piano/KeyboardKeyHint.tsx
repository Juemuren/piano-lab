interface KeyboardKeyHintProps {
  className: string;
  keyHints: ReadonlyMap<number, string>;
  note: number;
}

function KeyboardKeyHint({ className, keyHints, note }: KeyboardKeyHintProps) {
  return <kbd className={className}>{keyHints.get(note)}</kbd>;
}

export default KeyboardKeyHint;
