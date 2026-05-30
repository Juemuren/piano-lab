import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type AbcElem,
  type NoteTimingEvent,
  type TuneObject,
  renderAbc,
  TimingCallbacks,
} from 'abcjs';
import { AbcPlayer } from '../services/abc/AbcPlayer';

const DOUBLE_CLICK_INTERVAL_MS = 500;

interface LastClickedNote {
  index: number;
  beats: number;
  clickedAt: number;
}

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
  const visualObjRef = useRef<TuneObject>(null);
  const timingCallbacksRef = useRef<TimingCallbacks | null>(null);
  const lastClickedNoteRef = useRef<LastClickedNote | null>(null);

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

  const getSelectedBeat = useCallback((abcElem: AbcElem) => {
    const currentSelectedNote = abcElem.currentTrackWholeNotes ?? 0;
    const beatLength = visualObjRef.current?.getBeatLength() ?? 1;

    if (Array.isArray(currentSelectedNote)) {
      return currentSelectedNote[0] / beatLength;
    }
    return currentSelectedNote / beatLength;
  }, []);

  const getSelectedIndex = () => {
    const selectedElement = document.querySelector('.abcjs-note_selected');
    return parseInt(selectedElement?.getAttribute('data-index') || '0');
  };

  const handleStop = useCallback(() => {
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop();
    }
    setIsPlaying(false);
    onStop();
    removeHighlight();
  }, [onStop]);

  const handlePlay = useCallback(() => {
    onStop();
    removeHighlight();
    if (timingCallbacksRef.current) {
      timingCallbacksRef.current.stop();
      timingCallbacksRef.current.start(
        lastClickedNoteRef.current?.beats,
        'beats',
      );
      setIsPlaying(true);
    }
  }, [onStop]);

  useEffect(() => {
    lastClickedNoteRef.current = null;
  }, [abcContent]);

  useEffect(() => {
    const clickListener = (abcElem: AbcElem) => {
      if (visualObjRef.current) {
        const now = performance.now();
        const clickedIndex = getSelectedIndex();
        const prevClickedNote = lastClickedNoteRef.current;
        lastClickedNoteRef.current = {
          index: clickedIndex,
          beats: getSelectedBeat(abcElem),
          clickedAt: now,
        };
        if (
          prevClickedNote?.index === clickedIndex &&
          now - prevClickedNote.clickedAt <= DOUBLE_CLICK_INTERVAL_MS
        ) {
          handleStop();
          handlePlay();
          return;
        }
        if (abcElem.midiPitches && abcElem.midiPitches.length > 0) {
          abcPlayer.play(
            abcElem.midiPitches,
            visualObjRef.current?.millisecondsPerMeasure(),
          );
        }
      }
    };

    const eventCallback = (ev: NoteTimingEvent | null) => {
      removeHighlight();
      if (!ev) {
        setIsPlaying(false);
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
    setHasNotes(visualObjRef.current.lines.length > 0);

    timingCallbacksRef.current = new TimingCallbacks(visualObjRef.current, {
      eventCallback,
    });
  }, [
    abcContent,
    abcPlayer,
    getSelectedBeat,
    handleStop,
    handlePlay,
    renderTargetId,
  ]);

  return {
    isPlaying,
    hasNotes,
    handlePlay,
    handleStop,
  };
}

export default useAbcPlayback;
