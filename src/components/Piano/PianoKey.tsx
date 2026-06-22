import type { CSSProperties, MouseEvent, ReactNode, TouchEvent } from 'react';

interface PianoKeyProps {
  children: ReactNode;
  className: string;
  height: number;
  isMouseControlEnabled: boolean;
  isPressed: boolean;
  normalClassName: string;
  note: number;
  onKeyDown: (e: MouseEvent | TouchEvent, note: number) => void;
  onKeyUp: (e: MouseEvent | TouchEvent, note: number) => void;
  pressedClassName: string;
  style?: CSSProperties;
  width: number;
}

function PianoKey({
  note,
  isPressed,
  isMouseControlEnabled,
  className,
  normalClassName,
  pressedClassName,
  width,
  height,
  style,
  children,
  onKeyDown,
  onKeyUp,
}: PianoKeyProps) {
  const cursorClass = isMouseControlEnabled
    ? 'cursor-pointer'
    : 'cursor-default';
  const colorClass = isPressed ? pressedClassName : normalClassName;

  return (
    <button
      className={`
        text-xs transition-all duration-100
        ${colorClass} ${cursorClass} ${className}
      `}
      key={note}
      onMouseDown={(e) => onKeyDown(e, note)}
      onMouseLeave={(e) => onKeyUp(e, note)}
      onMouseUp={(e) => onKeyUp(e, note)}
      onTouchCancel={(e) => onKeyUp(e, note)}
      onTouchEnd={(e) => onKeyUp(e, note)}
      onTouchStart={(e) => onKeyDown(e, note)}
      style={{
        ...style,
        height: height,
        transform: isPressed ? 'translateY(2px)' : 'translateY(0px)',
        width: width,
      }}
      title={note.toString()}
      type="button"
    >
      {children}
    </button>
  );
}

export default PianoKey;
