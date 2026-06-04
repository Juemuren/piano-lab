import { useCallback, useEffect, useRef, useState } from 'react';
import type { SynthEngine } from '../../services/synth/SynthEngine';
import { downloadBlob } from '../../utils/file';

const RECORDING_FORMAT_OPTIONS: RecordingFormat[] = [
  {
    label: 'WebM',
    mimeType: 'audio/webm',
    extension: 'webm',
  },
  {
    label: 'OGG',
    mimeType: 'audio/ogg',
    extension: 'ogg',
  },
  {
    label: 'MP4',
    mimeType: 'audio/mp4',
    extension: 'mp4',
  },
];

type RecorderStatus = 'idle' | 'recording' | 'ready' | 'unsupported';

interface RecordingFormat {
  label: string;
  mimeType: string;
  extension: string;
}

const getSupportedRecordingFormats = () => {
  if (typeof MediaRecorder === 'undefined') {
    return [];
  }

  return RECORDING_FORMAT_OPTIONS.filter((format) =>
    MediaRecorder.isTypeSupported(format.mimeType),
  );
};

const getRecordingFileName = (blob: Blob, selectedFormat?: RecordingFormat) => {
  const extension =
    RECORDING_FORMAT_OPTIONS.find((format) =>
      blob.type.includes(format.extension),
    )?.extension ||
    selectedFormat?.extension ||
    'webm';

  return `synth-recording.${extension}`;
};

function useSynthRecorder(synthEngine: SynthEngine) {
  const [supportedFormats] = useState(() => getSupportedRecordingFormats());
  const [status, setStatus] = useState<RecorderStatus>(() =>
    typeof MediaRecorder === 'undefined' || supportedFormats.length === 0
      ? 'unsupported'
      : 'idle',
  );
  const [selectedMimeType, setSelectedMimeType] = useState(
    () => supportedFormats[0]?.mimeType || '',
  );
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [errorKey, setErrorKey] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const disconnectRef = useRef<(() => void) | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupRecordingTarget = useCallback(() => {
    disconnectRef.current?.();
    disconnectRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    if (typeof MediaRecorder === 'undefined') {
      setStatus('unsupported');
      setErrorKey('settings.recording.status.unsupported');
      return;
    }

    const selectedFormat = supportedFormats.find(
      (format) => format.mimeType === selectedMimeType,
    );

    if (!selectedFormat) {
      setStatus('unsupported');
      setErrorKey('settings.recording.status.unsupported');
      return;
    }

    if (recorderRef.current?.state === 'recording') {
      return;
    }

    const recordingTarget = await synthEngine.createRecordingTarget();

    if (!recordingTarget) {
      setErrorKey('settings.recording.status.error');
      return;
    }

    const recorder = new MediaRecorder(recordingTarget.stream, {
      mimeType: selectedFormat.mimeType,
    });

    chunksRef.current = [];
    recorderRef.current = recorder;
    disconnectRef.current = recordingTarget.disconnect;
    streamRef.current = recordingTarget.stream;
    setRecordingBlob(null);
    setErrorKey('');

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || selectedFormat.mimeType,
      });

      recorderRef.current = null;
      chunksRef.current = [];
      cleanupRecordingTarget();
      setRecordingBlob(blob);
      setStatus('ready');
    };

    recorder.onerror = () => {
      recorderRef.current = null;
      chunksRef.current = [];
      cleanupRecordingTarget();
      setErrorKey('settings.recording.status.error');
      setStatus('idle');
    };

    recorder.start();
    setStatus('recording');
  }, [cleanupRecordingTarget, selectedMimeType, supportedFormats, synthEngine]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;

    if (recorder?.state === 'recording') {
      recorder.stop();
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (!recordingBlob) {
      return;
    }

    const selectedFormat = supportedFormats.find(
      (format) => format.mimeType === selectedMimeType,
    );

    downloadBlob(
      recordingBlob,
      getRecordingFileName(recordingBlob, selectedFormat),
    );
  }, [recordingBlob, selectedMimeType, supportedFormats]);

  useEffect(
    () => () => {
      const recorder = recorderRef.current;

      if (recorder?.state === 'recording') {
        recorder.stop();
      } else {
        cleanupRecordingTarget();
      }
    },
    [cleanupRecordingTarget],
  );

  return {
    status,
    supportedFormats,
    selectedMimeType,
    setSelectedMimeType,
    recordingBlob,
    errorKey,
    startRecording,
    stopRecording,
    downloadRecording,
  };
}

export default useSynthRecorder;
