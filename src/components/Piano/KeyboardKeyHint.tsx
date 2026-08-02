interface KeyboardKeyHintProps {
  className: string;
  keyHints: ReadonlyMap<number, string>;
  note: number;
}

function KeyboardKeyHint({ className, keyHints, note }: KeyboardKeyHintProps) {
  const keyHint = keyHints.get(note);
  if (keyHint === undefined) {
    return null;
  }

  return <kbd className={className}>{keyHint}</kbd>;
}

export default KeyboardKeyHint;
