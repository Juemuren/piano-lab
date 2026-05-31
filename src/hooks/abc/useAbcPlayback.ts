import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type AbcElem,
  type BeatCallback,
  type NoteTimingEvent,
  type TuneObject,
  renderAbc,
  TimingCallbacks,
} from 'abcjs';
import { AbcPlayer } from '../../services/abc/AbcPlayer';

const BEAT_SUBDIVISIONS = 8;

const removeHighlight = () => {
  document
    .querySelectorAll('.abcjs-highlight')
    .forEach((el) => el.classList.remove('abcjs-highlight'));
};

const addHighlight = (elements: HTMLElement[]) => {
  elements.forEach((element) => {
    element.classList.add('abcjs-highlight');
  });
};

interface UseAbcPlaybackOptions {
  abcContent: string;
  abcPlayer: AbcPlayer;
  onStop: () => void;
  renderTargetId: string;
}

function useAbcPlayback({
  abcContent,
  abcPlayer,
  onStop,
  renderTargetId,
}: UseAbcPlaybackOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaybackEnded, setIsPlaybackEnded] = useState(false);
  const [hasNotes, setHasNotes] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const visualObjRef = useRef<TuneObject>(null);
  const timingCallbacksRef = useRef<TimingCallbacks | null>(null);
  const isPlayingRef = useRef(false);
  const currentSecondsRef = useRef(0);
  const totalSecondsRef = useRef(0);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const getSelectedSeconds = useCallback((abcElem: AbcElem) => {
    const currentMilliseconds = abcElem.currentTrackMilliseconds ?? 0;

    if (Array.isArray(currentMilliseconds)) {
      return currentMilliseconds[0] / 1000;
    }
    return currentMilliseconds / 1000;
  }, []);

  const updateCurrentSeconds = useCallback(
    (seconds: number, total = totalSecondsRef.current) => {
      const nextSeconds = Math.max(0, Math.min(seconds, total));
      currentSecondsRef.current = nextSeconds;
      setCurrentSeconds(nextSeconds);
    },
    [],
  );

  const updateTotalSeconds = useCallback(
    (seconds: number) => {
      totalSecondsRef.current = seconds;
      setTotalSeconds(seconds);
      updateCurrentSeconds(currentSecondsRef.current, seconds);
    },
    [updateCurrentSeconds],
  );

  const setProgress = useCallback(
    (seconds: number) => {
      isSeekingRef.current = true;
      timingCallbacksRef.current?.setProgress(seconds, 'seconds');
      updateCurrentSeconds(seconds);
      setIsPlaybackEnded(
        totalSecondsRef.current > 0 && seconds >= totalSecondsRef.current,
      );
      window.setTimeout(() => {
        isSeekingRef.current = false;
      }, 0);
    },
    [updateCurrentSeconds],
  );

  const resetProgress = useCallback(() => {
    timingCallbacksRef.current?.reset();
    updateCurrentSeconds(0);
    setIsPlaybackEnded(false);
    removeHighlight();
  }, [updateCurrentSeconds]);

  const handleProgressChange = useCallback(
    (seconds: number) => {
      setProgress(seconds);
    },
    [setProgress],
  );

  const setPlaying = useCallback((playing: boolean) => {
    isPlayingRef.current = playing;
    setIsPlaying(playing);
  }, []);

  const handlePause = useCallback(() => {
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.pause();
      updateCurrentSeconds(
        timingCallbacksRef.current.currentMillisecond() / 1000,
      );
    }
    setPlaying(false);
    onStop();
  }, [onStop, setPlaying, updateCurrentSeconds]);

  const handlePlay = useCallback(() => {
    onStop();
    removeHighlight();
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop();
      timingCallbacksRef.current.start(currentSecondsRef.current, 'seconds');
      setIsPlaybackEnded(false);
      setPlaying(true);
    }
  }, [onStop, setPlaying]);

  const handleReplay = useCallback(() => {
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop();
    }
    setPlaying(false);
    updateCurrentSeconds(0);
    setIsPlaybackEnded(false);
    handlePlay();
  }, [handlePlay, setPlaying, updateCurrentSeconds]);

  useEffect(() => {
    const clickListener = (abcElem: AbcElem) => {
      if (!visualObjRef.current || isPlayingRef.current) {
        return;
      }

      setProgress(getSelectedSeconds(abcElem));
    };

    const beatCallback: BeatCallback = (
      _beatNumber,
      _totalBeats,
      totalTime,
    ) => {
      updateTotalSeconds(totalTime / 1000);
      updateCurrentSeconds(
        (timingCallbacksRef.current?.currentMillisecond() ?? 0) / 1000,
        totalTime / 1000,
      );
    };

    const eventCallback = (ev: NoteTimingEvent | null) => {
      removeHighlight();
      if (!ev) {
        updateCurrentSeconds(totalSecondsRef.current);
        setIsPlaybackEnded(true);
        setPlaying(false);
        return;
      }
      ev.elements?.forEach((noteGroup) => {
        addHighlight(noteGroup);
      });
      if (ev.midiPitches && !isSeekingRef.current) {
        abcPlayer.play(ev.midiPitches, ev.millisecondsPerMeasure);
      }
      return 'continue';
    };

    visualObjRef.current = renderAbc(renderTargetId, abcContent, {
      responsive: 'resize',
      add_classes: true,
      clickListener,
    })[0];
    visualObjRef.current.setUpAudio({});
    const timingCallbacks = new TimingCallbacks(visualObjRef.current, {
      beatCallback,
      beatSubdivisions: BEAT_SUBDIVISIONS,
      eventCallback,
    });
    timingCallbacksRef.current = timingCallbacks;

    const nextTotalSeconds = visualObjRef.current.getTotalTime() ?? 0;
    setHasNotes(visualObjRef.current.lines.length > 0);
    setIsPlaybackEnded(false);
    updateTotalSeconds(nextTotalSeconds);
    updateCurrentSeconds(0, nextTotalSeconds);

    return () => {
      timingCallbacks.stop();
      if (timingCallbacksRef.current === timingCallbacks) {
        timingCallbacksRef.current = null;
      }
    };
  }, [
    abcContent,
    abcPlayer,
    getSelectedSeconds,
    setProgress,
    updateCurrentSeconds,
    updateTotalSeconds,
    setPlaying,
    renderTargetId,
  ]);

  return {
    isPlaying,
    isPlaybackEnded,
    hasNotes,
    currentSeconds,
    totalSeconds,
    handlePlay,
    handlePause,
    handleReplay,
    handleProgressChange,
    resetProgress,
  };
}

export default useAbcPlayback;
