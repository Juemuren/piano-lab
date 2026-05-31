import { Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AbcPlaybackControlsProps {
  isPlaying: boolean;
  isPlaybackEnded: boolean;
  currentSeconds: number;
  totalSeconds: number;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
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
  isPlaybackEnded,
  currentSeconds,
  totalSeconds,
  onPlay,
  onPause,
  onReplay,
  onProgressChange,
}: AbcPlaybackControlsProps) {
  const { t } = useTranslation('common');
  const canReplay = isPlaying || currentSeconds > 0 || isPlaybackEnded;

  return (
    <div className="flex w-full items-center gap-3 rounded-xl">
      <button
        type="button"
        disabled={isPlaybackEnded}
        onClick={isPlaying ? onPause : onPlay}
        className={`
            p-2 rounded-lg text-app-on-accent transition-colors
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              isPlaying
                ? 'bg-app-danger hover:bg-app-danger-strong disabled:hover:bg-app-danger'
                : 'bg-app-success hover:bg-app-success-strong disabled:hover:bg-app-success'
            }
          `}
      >
        {isPlaying ? (
          <Pause size={18} aria-label={t('actions.pause')} />
        ) : (
          <Play size={18} aria-label={t('actions.play')} />
        )}
      </button>

      <button
        type="button"
        disabled={!canReplay}
        onClick={onReplay}
        className="
            p-2 rounded-lg text-app-on-accent transition-colors
            disabled:cursor-not-allowed disabled:opacity-50
            bg-app-success hover:bg-app-success-strong disabled:hover:bg-app-success
          "
      >
        <RotateCcw size={18} aria-label={t('actions.replay')} />
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
