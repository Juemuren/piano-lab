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

function GamepadNoteIndicators({
  gamepadNotes,
  note,
}: GamepadNoteIndicatorsProps) {
  const activeIndicators = TRIGGER_INDICATORS.filter(
    ({ side }) => gamepadNotes[side] === note,
  );

  if (activeIndicators.length === 0) {
    return null;
  }

  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 flex -translate-x-1/2 gap-0.5">
      {activeIndicators.map(({ colorClassName, label, side }) => (
        <span
          className={`flex flex-col items-center ${colorClassName}`}
          key={side}
        >
          <span className="px-0.5 font-semibold text-xs leading-none">
            {label}
          </span>
          <ArrowDown size={14} strokeWidth={3} />
        </span>
      ))}
    </span>
  );
}

export default GamepadNoteIndicators;
