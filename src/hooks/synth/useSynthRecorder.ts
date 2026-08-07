import { useCallback, useEffect, useRef, useState } from 'react';
import type { SynthEngine } from '../../services/synth/SynthEngine';
import { downloadBlob } from '../../utils/file';

const RECORDING_FORMAT_OPTIONS: RecordingFormat[] = [
  {
    extension: 'webm',
    label: 'WebM',
    mimeType: 'audio/webm',
  },
  {
    extension: 'ogg',
    label: 'OGG',
    mimeType: 'audio/ogg',
  },
  {
    extension: 'mp4',
    label: 'MP4',
    mimeType: 'audio/mp4',
  },
];

type RecorderStatus = 'idle' | 'recording' | 'ready' | 'unsupported';

interface RecordingFormat {
  extension: string;
  label: string;
  mimeType: string;
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
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorKey, setErrorKey] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const disconnectRef = useRef<(() => void) | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartedAtRef = useRef(0);

  const cleanupRecordingTarget = useCallback(() => {
    disconnectRef.current?.();
    disconnectRef.current = null;
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
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
    setRecordingSeconds(0);
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
      setRecordingSeconds(
        (performance.now() - recordingStartedAtRef.current) / 1000,
      );
      setStatus('ready');
    };

    recorder.onerror = () => {
      recorderRef.current = null;
      chunksRef.current = [];
      cleanupRecordingTarget();
      setErrorKey('settings.recording.status.error');
      setStatus('idle');
    };

    recordingStartedAtRef.current = performance.now();
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
    downloadRecording,
    errorKey,
    recordingBlob,
    recordingSeconds,
    selectedMimeType,
    setSelectedMimeType,
    startRecording,
    status,
    stopRecording,
    supportedFormats,
  };
}

export default useSynthRecorder;
