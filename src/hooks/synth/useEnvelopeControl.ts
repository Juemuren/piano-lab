import { useEffect, useMemo, useState } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';
import type { EnvelopeConfig, EnvelopeCurve } from '../../types';
import {
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
} from '../../constants';

const ENVELOPE_SUSTAIN_SECONDS = 1;
const ENVELOPE_HARMONIC_TIMES = 1;
const ENVELOPE_POINTS_PER_SEGMENT = 50;

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
  initialConfig?: EnvelopeConfig | null,
  onConfigChange?: (config: EnvelopeConfig) => void,
) {
  const synthEngine = useSynthEngine();
  const [attackTime, setAttackTime] = useState(
    () => initialConfig?.attackTime ?? DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  );
  const [decayTime, setDecayTime] = useState(
    () => initialConfig?.decayTime ?? DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  );
  const [releaseTime, setReleaseTime] = useState(
    () => initialConfig?.releaseTime ?? DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  );
  const [sustainGain, setSustainGain] = useState(
    () => initialConfig?.sustainGain ?? DEFAULT_ENVELOPE_SUSTAIN_GAIN,
  );
  const [silenceGain, setSilenceGain] = useState(
    () => initialConfig?.silenceGain ?? DEFAULT_ENVELOPE_SILENCE_GAIN,
  );

  const envelopeConfig = useMemo<EnvelopeConfig>(
    () => ({
      attackTime,
      decayTime,
      releaseTime,
      sustainGain,
      silenceGain,
    }),
    [attackTime, decayTime, releaseTime, silenceGain, sustainGain],
  );

  useEffect(() => {
    synthEngine.configureEnvelope(envelopeConfig);
  }, [envelopeConfig, synthEngine]);

  useEffect(() => {
    onConfigChange?.(envelopeConfig);
  }, [envelopeConfig, onConfigChange]);

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
    envelopeCurve,
  };
}

export default useEnvelopeControl;
