import { Circle, Download, Mic, Square } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSynthEngine } from '../../contexts/synthEngine';
import useSynthRecorder from '../../hooks/synth/useSynthRecorder';
import ControlButton from '../shared/ControlButton';
import ControlCheckbox from '../shared/ControlCheckbox';
import ControlSelect from '../shared/ControlSelect';

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
    errorKey,
    startRecording,
    stopRecording,
    downloadRecording,
  } = useSynthRecorder(synthEngine);
  const isRecording = status === 'recording';
  const isUnsupported = status === 'unsupported';

  return (
    <div className="flex flex-col gap-3">
      <ControlCheckbox
        checked={isExpanded}
        icon={<Mic size={16} />}
        label={t('settings.recordingEnable')}
        onChange={(e) => setIsExpanded(e.target.checked)}
      />
      {isExpanded && (
        <div className="flex flex-col gap-3 text-sm text-app-subtext dark:text-app-subtext-dark">
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
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-3">
            <ControlButton
              disabled={isRecording || isUnsupported}
              icon={<Circle size={18} />}
              label={t('settings.recording.start')}
              onClick={startRecording}
            />
            <ControlButton
              disabled={!isRecording}
              icon={<Square size={18} />}
              label={t('settings.recording.stop')}
              onClick={stopRecording}
            />
            <ControlButton
              disabled={!recordingBlob || isRecording}
              icon={<Download size={18} />}
              label={t('settings.recording.download')}
              onClick={downloadRecording}
            />
          </div>
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
