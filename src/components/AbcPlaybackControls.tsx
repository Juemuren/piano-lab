import { useTranslation } from 'react-i18next';

interface AbcPlaybackControlsProps {
  isPlaying: boolean;
  currentSeconds: number;
  totalSeconds: number;
  onPlay: () => void;
  onStop: () => void;
  onProgressChange: (seconds: number) => void;
}

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

function AbcPlaybackControls({
  isPlaying,
  currentSeconds,
  totalSeconds,
  onPlay,
  onStop,
  onProgressChange,
}: AbcPlaybackControlsProps) {
  const { t } = useTranslation('common');

  return (
    <div
      className="flex w-full items-center gap-3 rounded-xl
      "
    >
      <button
        type="button"
        onClick={isPlaying ? onStop : onPlay}
        className={`
          px-4 py-2 rounded-lg text-app-on-accent transition-colors
          ${
            isPlaying
              ? 'bg-app-danger hover:bg-app-danger-strong'
              : 'bg-app-success hover:bg-app-success-strong'
          }
        `}
      >
        {isPlaying ? t('actions.stop') : t('actions.play')}
      </button>

      <input
        type="range"
        min={0}
        max={totalSeconds}
        step={0.1}
        value={currentSeconds}
        onChange={(e) => onProgressChange(parseFloat(e.target.value))}
        className="flex-1 accent-app-tip dark:accent-app-tip-dark"
      />

      <span className="w-24 text-right text-sm font-semibold tabular-nums">
        {formatTime(currentSeconds)} / {formatTime(totalSeconds)}
      </span>
    </div>
  );
}

export default AbcPlaybackControls;
