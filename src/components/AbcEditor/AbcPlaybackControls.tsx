import { useTranslation } from 'react-i18next';
import PlaybackControls from '../shared/PlaybackControls';

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
      <PlaybackControls
        currentSeconds={currentSeconds}
        isPlaybackEnded={isPlaybackEnded}
        isPlaying={isPlaying}
        onPause={onPause}
        onPlay={onPlay}
        onProgressChange={onProgressChange}
        onReplay={onReplay}
        totalSeconds={totalSeconds}
      />

      <p className="text-app-tip/50 text-xs dark:text-app-tip-dark/50">
        {t('playbackTip')}
      </p>
    </div>
  );
}

export default AbcPlaybackControls;
