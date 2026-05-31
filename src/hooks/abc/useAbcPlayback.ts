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
  const [hasNotes, setHasNotes] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const visualObjRef = useRef<TuneObject>(null);
  const timingCallbacksRef = useRef<TimingCallbacks | null>(null);
  const isPlayingRef = useRef(false);
  const currentBeatRef = useRef(0);
  const totalBeatsRef = useRef(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const getSelectedBeat = useCallback((abcElem: AbcElem) => {
    const currentSelectedNote = abcElem.currentTrackWholeNotes ?? 0;
    const beatLength = visualObjRef.current?.getBeatLength() ?? 1;

    if (Array.isArray(currentSelectedNote)) {
      return currentSelectedNote[0] / beatLength;
    }
    return currentSelectedNote / beatLength;
  }, []);

  const updateCurrentBeat = useCallback(
    (beat: number, total = totalBeatsRef.current) => {
      const nextBeat = Math.max(0, Math.min(beat, total));
      currentBeatRef.current = nextBeat;
      setCurrentBeat(nextBeat);
    },
    [],
  );

  const updateTotalBeats = useCallback(
    (beatCount: number) => {
      totalBeatsRef.current = beatCount;
      setTotalBeats(beatCount);
      updateCurrentBeat(currentBeatRef.current, beatCount);
    },
    [updateCurrentBeat],
  );

  const setProgress = useCallback(
    (beat: number) => {
      timingCallbacksRef.current?.setProgress(beat, 'beats');
      updateCurrentBeat(beat);
    },
    [updateCurrentBeat],
  );

  const resetProgress = useCallback(() => {
    timingCallbacksRef.current?.reset();
    updateCurrentBeat(0);
    removeHighlight();
  }, [updateCurrentBeat]);

  const handleProgressChange = useCallback(
    (beat: number) => {
      setProgress(beat);
    },
    [setProgress],
  );

  const setPlaying = useCallback((playing: boolean) => {
    isPlayingRef.current = playing;
    setIsPlaying(playing);
  }, []);

  const handleStop = useCallback(() => {
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop();
    }
    setPlaying(false);
    updateCurrentBeat(0);
    onStop();
    removeHighlight();
  }, [onStop, setPlaying, updateCurrentBeat]);

  const handlePlay = useCallback(() => {
    onStop();
    removeHighlight();
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop();
      timingCallbacksRef.current.start(currentBeatRef.current, 'beats');
      setPlaying(true);
    }
  }, [onStop, setPlaying]);

  useEffect(() => {
    const clickListener = (abcElem: AbcElem) => {
      if (!visualObjRef.current || isPlayingRef.current) {
        return;
      }

      setProgress(getSelectedBeat(abcElem));
    };

    const beatCallback: BeatCallback = (beatNumber, total) => {
      updateTotalBeats(total);
      updateCurrentBeat(beatNumber, total);
    };

    const eventCallback = (ev: NoteTimingEvent | null) => {
      removeHighlight();
      if (!ev) {
        setPlaying(false);
        return;
      }
      ev.elements?.forEach((noteGroup) => {
        addHighlight(noteGroup);
      });
      if (ev.midiPitches) {
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
    const nextTotalBeats = visualObjRef.current.getTotalBeats();
    setHasNotes(visualObjRef.current.lines.length > 0);
    updateTotalBeats(nextTotalBeats);
    updateCurrentBeat(0, nextTotalBeats);

    const timingCallbacks = new TimingCallbacks(visualObjRef.current, {
      beatCallback,
      beatSubdivisions: BEAT_SUBDIVISIONS,
      eventCallback,
    });
    timingCallbacksRef.current = timingCallbacks;

    return () => {
      timingCallbacks.stop();
      if (timingCallbacksRef.current === timingCallbacks) {
        timingCallbacksRef.current = null;
      }
    };
  }, [
    abcContent,
    abcPlayer,
    getSelectedBeat,
    setProgress,
    updateCurrentBeat,
    updateTotalBeats,
    setPlaying,
    renderTargetId,
  ]);

  return {
    isPlaying,
    hasNotes,
    currentBeat,
    totalBeats,
    handlePlay,
    handleStop,
    handleProgressChange,
    resetProgress,
  };
}

export default useAbcPlayback;
