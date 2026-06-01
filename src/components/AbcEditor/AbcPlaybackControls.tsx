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
  const { t } = useTranslation('score');

  return (
    <div className="w-full">
      <div className="w-full rounded-xl py-2 flex items-center gap-2">
        <button
          type="button"
          disabled={isPlaybackEnded}
          onClick={isPlaying ? onPause : onPlay}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          type="button"
          disabled={currentSeconds <= 0}
          onClick={onReplay}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={18} />
        </button>

        <input
          type="range"
          min={0}
          max={totalSeconds}
          step={0.1}
          value={currentSeconds}
          onChange={(e) => onProgressChange(parseFloat(e.target.value))}
          className="flex-1 accent-app-tip dark:accent-app-tip-dark min-w-0"
        />

        <span className="w-fit text-right tabular-nums text-xs sm:text-sm sm:font-semibold">
          {formatTime(currentSeconds)} / {formatTime(totalSeconds)}
        </span>
      </div>

      <p className="text-xs text-app-tip/50 dark:text-app-tip-dark/50">
        {t('playbackTip')}
      </p>
    </div>
  );
}

export default AbcPlaybackControls;
