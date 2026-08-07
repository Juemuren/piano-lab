import { Circle, Download, Mic, Square } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSynthEngine } from '../../contexts/synthEngine';
import useRecordingPlayback from '../../hooks/synth/useRecordingPlayback';
import useSynthRecorder from '../../hooks/synth/useSynthRecorder';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';
import ControlSelect from '../shared/ControlSelect';
import PlaybackControls from '../shared/PlaybackControls';

function SynthRecorderSettings() {
  const { t } = useTranslation('app');
  const [isExpanded, setIsExpanded] = useState(false);
  const synthEngine = useSynthEngine();
  const {
    status,
    supportedFormats,
    selectedMimeType,
    setSelectedMimeType,
    recordingBlob,
    recordingSeconds,
    errorKey,
    startRecording,
    stopRecording,
    downloadRecording,
  } = useSynthRecorder(synthEngine);
  const isRecording = status === 'recording';
  const isUnsupported = status === 'unsupported';
  const {
    currentSeconds,
    handlePause,
    handlePlay,
    handleProgressChange,
    handleReplay,
    isPlaybackEnded,
    isPlaying,
    totalSeconds,
  } = useRecordingPlayback(recordingBlob, recordingSeconds);

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        checked={isExpanded}
        icon={<Mic size={16} />}
        label={t('settings.recordingEnable')}
        onChange={(e) => setIsExpanded(e.target.checked)}
      />
      {isExpanded && (
        <div className="flex flex-col gap-3 text-app-subtext text-sm dark:text-app-subtext-dark">
          {!isUnsupported && (
            <ControlSelect
              disabled={isRecording}
              label={t('settings.recording.format')}
              onChange={(e) => setSelectedMimeType(e.target.value)}
              value={selectedMimeType}
            >
              {supportedFormats.map((format) => (
                <option key={format.mimeType} value={format.mimeType}>
                  {format.label}
                </option>
              ))}
            </ControlSelect>
          )}
          <div className="grid grid-cols-3 gap-2">
            <ControlButton
              bgClassName="bg-app-tip/15 hover:bg-app-tip/25 dark:bg-app-tip-dark/15 dark:hover:bg-app-tip-dark/25"
              colorClassName="text-app-tip dark:text-app-tip-dark"
              disabled={isRecording || isUnsupported}
              icon={<Circle size={18} />}
              label={t('settings.recording.start')}
              onClick={startRecording}
            />
            <ControlButton
              bgClassName="bg-app-error/15 hover:bg-app-error/25 dark:bg-app-error-dark/15 dark:hover:bg-app-error-dark/25"
              colorClassName="text-app-error dark:text-app-error-dark"
              disabled={!isRecording}
              icon={<Square size={18} />}
              label={t('settings.recording.stop')}
              onClick={stopRecording}
            />
            <ControlButton
              bgClassName="bg-app-info/15 hover:bg-app-info/25 dark:bg-app-info-dark/15 dark:hover:bg-app-info-dark/25"
              colorClassName="text-app-info dark:text-app-info-dark"
              disabled={!recordingBlob || isRecording}
              icon={<Download size={18} />}
              label={t('settings.recording.download')}
              onClick={downloadRecording}
            />
          </div>
          {recordingBlob && (
            <PlaybackControls
              currentSeconds={currentSeconds}
              disabled={totalSeconds === 0}
              isPlaybackEnded={isPlaybackEnded}
              isPlaying={isPlaying}
              onPause={handlePause}
              onPlay={handlePlay}
              onProgressChange={handleProgressChange}
              onReplay={handleReplay}
              totalSeconds={totalSeconds}
            />
          )}
          {(isRecording || errorKey) && (
            <p>
              {isRecording
                ? t('settings.recording.status.recording')
                : t(errorKey)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SynthRecorderSettings;
