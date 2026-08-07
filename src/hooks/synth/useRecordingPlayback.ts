import { useCallback, useEffect, useRef, useState } from 'react';

function useRecordingPlayback(
  recordingBlob: Blob | null,
  recordingSeconds: number,
) {
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [isPlaybackEnded, setIsPlaybackEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setCurrentSeconds(0);
    setIsPlaybackEnded(false);
    setIsPlaying(false);
    setTotalSeconds(recordingSeconds);

    if (!recordingBlob) {
      return;
    }

    const recordingUrl = URL.createObjectURL(recordingBlob);
    const audio = new Audio(recordingUrl);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) {
        setTotalSeconds(audio.duration);
      }
    };
    const updateProgress = () => {
      setCurrentSeconds(audio.currentTime);
    };
    const handleEnded = () => {
      setCurrentSeconds(
        Number.isFinite(audio.duration) ? audio.duration : recordingSeconds,
      );
      setIsPlaybackEnded(true);
      setIsPlaying(false);
    };

    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
      URL.revokeObjectURL(recordingUrl);
    };
  }, [recordingBlob, recordingSeconds]);

  const handlePlay = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setIsPlaybackEnded(false);
    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  const handlePause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleReplay = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    setCurrentSeconds(0);
    setIsPlaybackEnded(false);
    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  const handleProgressChange = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      audio.currentTime = seconds;
      setCurrentSeconds(seconds);
      setIsPlaybackEnded(seconds >= totalSeconds);
    },
    [totalSeconds],
  );

  return {
    currentSeconds,
    handlePause,
    handlePlay,
    handleProgressChange,
    handleReplay,
    isPlaybackEnded,
    isPlaying,
    totalSeconds,
  };
}

export default useRecordingPlayback;
