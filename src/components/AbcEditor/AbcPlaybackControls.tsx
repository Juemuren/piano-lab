import { Pause, Play, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IconButton from '../shared/IconButton';
import RangeInput from '../shared/RangeInput';

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
        <IconButton
          colorClassName={
            isPlaying
              ? 'text-app-error dark:text-app-error-dark'
              : 'text-app-tip dark:text-app-tip-dark'
          }
          disabled={isPlaybackEnded}
          icon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
          onClick={isPlaying ? onPause : onPlay}
        />

        <IconButton
          colorClassName="text-app-warning dark:text-app-warning-dark"
          disabled={currentSeconds <= 0}
          icon={<RotateCcw size={18} />}
          onClick={onReplay}
        />

        <RangeInput
          accentClassName={
            isPlaying
              ? 'text-app-tip dark:text-app-tip-dark'
              : 'text-app-error dark:text-app-error-dark'
          }
          className="min-w-0 flex-1"
          max={totalSeconds}
          min={0}
          onChange={onProgressChange}
          step={0.1}
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
