import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { AudioEngine } from '../services/audio/AudioEngine';
import type { EnvelopeConfig } from '../types';

const ENVELOPE_SUSTAIN_SECONDS = 1;
const ENVELOPE_HARMONIC_TIMES = 1;
const ENVELOPE_POINTS_PER_SEGMENT = 50;

export interface EnvelopeCurve {
  time: number[];
  gain: number[];
  maxTime: number;
}

function sampleExponentialRamp(
  startTime: number,
  endTime: number,
  startGain: number,
  endGain: number,
) {
  return Array.from({ length: ENVELOPE_POINTS_PER_SEGMENT + 1 }, (_, index) => {
    const progress = index / ENVELOPE_POINTS_PER_SEGMENT;
    const time = startTime + (endTime - startTime) * progress;
    const gain = startGain * Math.pow(endGain / startGain, progress);

    return { time, gain };
  });
}

function useEnvelopeControl(
  audioEngine: AudioEngine,
  initialConfig?: EnvelopeConfig | null,
  onConfigChange?: (config: EnvelopeConfig) => void,
) {
  const [attackTime, setAttackTime] = useState(
    () => initialConfig?.attackTime ?? audioEngine.getAttackTime(),
  );
  const [decayTime, setDecayTime] = useState(
    () => initialConfig?.decayTime ?? audioEngine.getDecayTime(),
  );
  const [releaseTime, setReleaseTime] = useState(
    () => initialConfig?.releaseTime ?? audioEngine.getReleaseTime(),
  );
  const [sustainGain, setSustainGain] = useState(
    () => initialConfig?.sustainGain ?? audioEngine.getSustainGain(),
  );
  const [silenceGain, setSilenceGain] = useState(
    () => initialConfig?.silenceGain ?? audioEngine.getSilenceGain(),
  );
  const envelopeChartContainerRef = useRef<HTMLDivElement>(null);
  const [envelopeChartWidth, setEnvelopeChartWidth] = useState(0);

  useLayoutEffect(() => {
    const element = envelopeChartContainerRef.current;
    if (!element) return;

    const updateEnvelopeChartWidth = () => {
      setEnvelopeChartWidth(element.getBoundingClientRect().width);
    };
    updateEnvelopeChartWidth();
    const resizeObserver = new ResizeObserver(updateEnvelopeChartWidth);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    audioEngine.setAttackTime(attackTime);
  }, [attackTime, audioEngine]);

  useEffect(() => {
    audioEngine.setDecayTime(decayTime);
  }, [decayTime, audioEngine]);

  useEffect(() => {
    audioEngine.setReleaseTime(releaseTime);
  }, [releaseTime, audioEngine]);

  useEffect(() => {
    audioEngine.setSustainGain(sustainGain);
  }, [sustainGain, audioEngine]);

  useEffect(() => {
    audioEngine.setSilenceGain(silenceGain);
  }, [silenceGain, audioEngine]);

  useEffect(() => {
    onConfigChange?.({
      attackTime,
      decayTime,
      releaseTime,
      sustainGain,
      silenceGain,
    });
  }, [
    attackTime,
    decayTime,
    onConfigChange,
    releaseTime,
    silenceGain,
    sustainGain,
  ]);

  const envelopeCurve = useMemo<EnvelopeCurve>(() => {
    const attackEnd = attackTime;
    const decayEnd = attackEnd + decayTime;
    const sustainEnd = decayEnd + ENVELOPE_SUSTAIN_SECONDS;
    const releaseEnd = sustainEnd + releaseTime;
    const attackGain = 1;
    const decayGain = Math.max(attackGain * sustainGain, silenceGain);
    const holdGain = Math.max(
      decayGain / Math.sqrt(1 + ENVELOPE_HARMONIC_TIMES),
      silenceGain,
    );

    const points = [
      ...sampleExponentialRamp(0, attackEnd, silenceGain, attackGain),
      ...sampleExponentialRamp(attackEnd, decayEnd, attackGain, decayGain),
      ...sampleExponentialRamp(decayEnd, sustainEnd, decayGain, holdGain),
      ...sampleExponentialRamp(sustainEnd, releaseEnd, holdGain, silenceGain),
    ];

    return {
      time: points.map(({ time }) => time),
      gain: points.map(({ gain }) => gain),
      maxTime: releaseEnd,
    };
  }, [attackTime, decayTime, releaseTime, silenceGain, sustainGain]);

  return {
    attackTime,
    setAttackTime,
    decayTime,
    setDecayTime,
    releaseTime,
    setReleaseTime,
    sustainGain,
    setSustainGain,
    silenceGain,
    setSilenceGain,
    envelopeChartContainerRef,
    envelopeChartWidth,
    envelopeCurve,
  };
}

export default useEnvelopeControl;
