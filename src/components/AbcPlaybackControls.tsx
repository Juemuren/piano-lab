import { useTranslation } from 'react-i18next';

interface AbcPlaybackControlsProps {
  isPlaying: boolean;
  currentBeat: number;
  totalBeats: number;
  onPlay: () => void;
  onStop: () => void;
  onProgressChange: (beat: number) => void;
}

function AbcPlaybackControls({
  isPlaying,
  currentBeat,
  totalBeats,
  onPlay,
  onStop,
  onProgressChange,
}: AbcPlaybackControlsProps) {
  const { t } = useTranslation('common');
  const progressPercent =
    totalBeats > 0 ? Math.round((currentBeat / totalBeats) * 100) : 0;

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
        max={totalBeats}
        step={0.125}
        value={currentBeat}
        onChange={(e) => onProgressChange(parseFloat(e.target.value))}
        className="flex-1 accent-app-tip dark:accent-app-tip-dark"
      />

      <span className="w-12 text-right text-sm font-semibold tabular-nums">
        {progressPercent}%
      </span>
    </div>
  );
}

export default AbcPlaybackControls;
