import type { GamepadNotes } from '../../hooks/piano/useGamepadControl';

interface GamepadNoteIndicatorsProps {
  gamepadNotes: GamepadNotes;
  note: number;
}

interface TriggerIndicator {
  arrowClassName: string;
  backgroundClassName: string;
  label: string;
  side: 'left' | 'right';
}

const TRIGGER_INDICATORS: TriggerIndicator[] = [
  {
    arrowClassName: 'border-t-app-info dark:border-t-app-info-dark',
    backgroundClassName: 'bg-app-info dark:bg-app-info-dark',
    label: 'L',
    side: 'left',
  },
  {
    arrowClassName: 'border-t-app-error dark:border-t-app-error-dark',
    backgroundClassName: 'bg-app-error dark:bg-app-error-dark',
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
    <span className="pointer-events-none absolute -top-6 bottom-full left-1/2 flex -translate-x-1/2 gap-0.5">
      {activeIndicators.map(
        ({ arrowClassName, backgroundClassName, label, side }) => (
          <span className="flex flex-col items-center" key={side}>
            <span
              className={`rounded px-1 text-piano-white text-xs leading-tight ${backgroundClassName}`}
            >
              {label}
            </span>
            <span className={`h-2 w-px ${backgroundClassName}`} />
            <span
              className={`h-0 w-0 border-x-4 border-x-transparent border-t-4 ${arrowClassName}`}
            />
          </span>
        ),
      )}
    </span>
  );
}

export default GamepadNoteIndicators;
