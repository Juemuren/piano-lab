import { ArrowDown } from 'lucide-react';
import type { GamepadNotes } from '../../hooks/piano/useGamepadControl';

interface GamepadNoteIndicatorsProps {
  gamepadNotes: GamepadNotes;
  note: number;
}

interface TriggerIndicator {
  colorClassName: string;
  label: string;
  side: 'left' | 'right';
}

const TRIGGER_INDICATORS: TriggerIndicator[] = [
  {
    colorClassName: 'text-app-info dark:text-app-info-dark',
    label: 'L',
    side: 'left',
  },
  {
    colorClassName: 'text-app-error dark:text-app-error-dark',
    label: 'R',
    side: 'right',
  },
];

const BOTH_TRIGGER_INDICATOR = {
  colorClassName: 'text-app-tip dark:text-app-tip-dark',
  label: 'B',
};

function GamepadNoteIndicators({
  gamepadNotes,
  note,
}: GamepadNoteIndicatorsProps) {
  const isOverlapping =
    gamepadNotes.left === note && gamepadNotes.right === note;
  const indicator = isOverlapping
    ? BOTH_TRIGGER_INDICATOR
    : TRIGGER_INDICATORS.find(({ side }) => gamepadNotes[side] === note);

  if (!indicator) {
    return null;
  }

  return (
    <span
      className={`pointer-events-none absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center ${indicator.colorClassName}`}
    >
      <span className="px-0.5 font-semibold text-xs leading-none">
        {indicator.label}
      </span>
      <ArrowDown size={14} strokeWidth={3} />
    </span>
  );
}

export default GamepadNoteIndicators;
