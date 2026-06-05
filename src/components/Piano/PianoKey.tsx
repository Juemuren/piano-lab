import type { ReactNode, MouseEvent, TouchEvent, CSSProperties } from 'react';

type PianoKeyProps = {
  note: number;
  isPressed: boolean;
  isMouseControlEnabled: boolean;
  className: string;
  normalClassName: string;
  pressedClassName: string;
  width: number;
  height: number;
  style?: CSSProperties;
  children: ReactNode;
  onKeyDown: (e: MouseEvent | TouchEvent, note: number) => void;
  onKeyUp: (e: MouseEvent | TouchEvent, note: number) => void;
};

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
      type="button"
      onMouseDown={(e) => onKeyDown(e, note)}
      onMouseUp={(e) => onKeyUp(e, note)}
      onMouseLeave={(e) => onKeyUp(e, note)}
      onTouchStart={(e) => onKeyDown(e, note)}
      onTouchEnd={(e) => onKeyUp(e, note)}
      onTouchCancel={(e) => onKeyUp(e, note)}
      className={`
        text-xs transition-all duration-100
        ${colorClass} ${cursorClass} ${className}
      `}
      style={{
        ...style,
        width: width,
        height: height,
        transform: isPressed ? 'translateY(2px)' : 'translateY(0px)',
      }}
    >
      {children}
    </button>
  );
}

export default PianoKey;
