import { type MouseEvent, type TouchEvent, useEffect, useState } from 'react';
import { AudioEngine } from '../services/audio/AudioEngine';
import { getPitchName, getPitchOctave } from '../utils/pitch';

const WHITE_KEY_HEIGHT_PX = 160;
const BLACK_KEY_HEIGHT_PX = 100;
const WHITE_KEY_WIDTH_PX = 30;
const BLACK_KEY_WIDTH_PX = 24;
const AVERAGE_KEY_WIDTH_PX = 20;
const CENTER_NOTE = 66; // F#4
const MAX_KEY_NUMS = 85; // C1 -> C8
const MIN_KEY_NUMS = 13; // C4 -> C5
const DEFAULT_DURATION_SECONDS = 1;
const DEFAULT_VOLUME = 100;

interface PianoProps {
  audioEngine: AudioEngine;
  playingNotes?: Set<number>;
}

function Piano({ audioEngine, playingNotes = new Set() }: PianoProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<number>>(new Set());
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    audioEngine.init();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [audioEngine]);

  const playNote = (note: number) => {
    audioEngine.playNote(note, DEFAULT_DURATION_SECONDS, DEFAULT_VOLUME);
  };

  const handleKeyDown = (e: MouseEvent | TouchEvent, note: number) => {
    if (!('touches' in e)) {
      e.preventDefault();
    }
    setPressedKeys((prev) => new Set(prev).add(note));
    playNote(note);
  };

  const handleKeyUp = (e: MouseEvent | TouchEvent, note: number) => {
    e.preventDefault();
    setPressedKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
  };

  const numKeys = Math.min(
    MAX_KEY_NUMS,
    Math.max(MIN_KEY_NUMS, Math.floor(windowWidth / AVERAGE_KEY_WIDTH_PX)),
  );
  const startNote = CENTER_NOTE - Math.floor((numKeys - 1) / 2);

  const whiteKeys = [];
  const blackKeys = [];
  for (let index = 0; index < numKeys; index++) {
    const note = startNote + index;
    const name = getPitchName(note);
    const octave = getPitchOctave(note);
    const keyInfo = {
      note,
      char: name[0],
      number: octave,
    };

    if (name.includes('#')) {
      const whiteKeyIndex = whiteKeys.length;
      blackKeys.push({ ...keyInfo, position: whiteKeyIndex });
    } else {
      whiteKeys.push(keyInfo);
    }
  }

  return (
    <div className="w-full pb-10">
      <div
        className="relative inline-block"
        style={{ height: WHITE_KEY_HEIGHT_PX }}
      >
        <div className="flex">
          {whiteKeys.map((key) => {
            const isPressed =
              pressedKeys.has(key.note) || playingNotes.has(key.note);
            return (
              <button
                key={key.note}
                onMouseDown={(e) => handleKeyDown(e, key.note)}
                onMouseUp={(e) => handleKeyUp(e, key.note)}
                onMouseLeave={(e) => handleKeyUp(e, key.note)}
                onTouchStart={(e) => handleKeyDown(e, key.note)}
                onTouchEnd={(e) => handleKeyUp(e, key.note)}
                onTouchCancel={(e) => handleKeyUp(e, key.note)}
                className={`
                  text-xs border border-app-accent transition-all duration-100 ${
                    isPressed
                      ? 'bg-piano-white-active text-piano-black shadow-inner'
                      : 'bg-piano-white text-piano-black'
                  }`}
                style={{
                  width: WHITE_KEY_WIDTH_PX,
                  height: WHITE_KEY_HEIGHT_PX,
                  transform: isPressed ? 'translateY(2px)' : 'translateY(0px)',
                }}
              >
                <span className="flex flex-col items-center justify-end h-full pb-2">
                  <span>
                    {key.char}
                    <sub>{key.number}</sub>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex absolute top-0 left-0">
          {blackKeys.map((key) => {
            const isPressed =
              pressedKeys.has(key.note) || playingNotes.has(key.note);
            return (
              <button
                key={key.note}
                onMouseDown={(e) => handleKeyDown(e, key.note)}
                onMouseUp={(e) => handleKeyUp(e, key.note)}
                onMouseLeave={(e) => handleKeyUp(e, key.note)}
                onTouchStart={(e) => handleKeyDown(e, key.note)}
                onTouchEnd={(e) => handleKeyUp(e, key.note)}
                onTouchCancel={(e) => handleKeyUp(e, key.note)}
                className={`
                  text-xs border-none transition-all duration-100 ${
                    isPressed
                      ? 'bg-piano-black-active text-piano-white shadow-inner'
                      : 'bg-piano-black text-piano-white'
                  }`}
                style={{
                  width: BLACK_KEY_WIDTH_PX,
                  height: BLACK_KEY_HEIGHT_PX,
                  position: 'absolute',
                  left:
                    key.position * WHITE_KEY_WIDTH_PX - BLACK_KEY_WIDTH_PX / 2,
                  transform: isPressed ? 'translateY(2px)' : 'translateY(0px)',
                  zIndex: 1,
                }}
              ></button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Piano;
