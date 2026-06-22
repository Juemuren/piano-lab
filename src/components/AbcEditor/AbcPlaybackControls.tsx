import { Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRangeProgressStyle } from '../../utils/range';

interface AbcPlaybackControlsProps {
  currentSeconds: number;
  isPlaybackEnded: boolean;
  isPlaying: boolean;
  onPause: () => void;
  onPlay: () => void;
  onProgressChange: (seconds: number) => void;
  onReplay: () => void;
  totalSeconds: number;
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
      <div className="flex w-full items-center gap-2 rounded-xl py-2">
        <button
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPlaybackEnded}
          onClick={isPlaying ? onPause : onPlay}
          type="button"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentSeconds <= 0}
          onClick={onReplay}
          type="button"
        >
          <RotateCcw size={18} />
        </button>

        <input
          className="range-input h-6 min-w-0 flex-1 text-app-tip dark:text-app-tip-dark"
          max={totalSeconds}
          min={0}
          onChange={(e) => onProgressChange(parseFloat(e.target.value))}
          step={0.1}
          style={getRangeProgressStyle(currentSeconds, 0, totalSeconds)}
          type="range"
          value={currentSeconds}
        />

        <span className="w-fit text-right text-xs tabular-nums sm:font-semibold sm:text-sm">
          {formatTime(currentSeconds)} / {formatTime(totalSeconds)}
        </span>
      </div>

      <p className="text-app-tip/50 text-xs dark:text-app-tip-dark/50">
        {t('playbackTip')}
      </p>
    </div>
  );
}

export default AbcPlaybackControls;
