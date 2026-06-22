import { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_ENVELOPE_ATTACK_TIME_SECONDS,
  DEFAULT_ENVELOPE_DECAY_TIME_SECONDS,
  DEFAULT_ENVELOPE_RELEASE_TIME_SECONDS,
  DEFAULT_ENVELOPE_SILENCE_GAIN,
  DEFAULT_ENVELOPE_SUSTAIN_GAIN,
} from '../../constants/synth';
import { useSynthEngine } from '../../contexts/synthEngine';
import type { EnvelopeConfig, EnvelopeCurve } from '../../types';

const ENVELOPE_SUSTAIN_SECONDS = 1;
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
    const gain = startGain * (endGain / startGain) ** progress;

    return { gain, time };
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
      silenceGain,
      sustainGain,
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
    const decayGain = attackGain * sustainGain;

    const points = [
      ...sampleExponentialRamp(0, attackEnd, silenceGain, attackGain),
      ...sampleExponentialRamp(attackEnd, decayEnd, attackGain, decayGain),
      ...sampleExponentialRamp(decayEnd, sustainEnd, decayGain, decayGain),
      ...sampleExponentialRamp(sustainEnd, releaseEnd, decayGain, silenceGain),
    ];

    return {
      gain: points.map(({ gain }) => gain),
      maxTime: releaseEnd,
      time: points.map(({ time }) => time),
    };
  }, [attackTime, decayTime, releaseTime, silenceGain, sustainGain]);

  return {
    attackTime,
    decayTime,
    envelopeCurve,
    releaseTime,
    setAttackTime,
    setDecayTime,
    setReleaseTime,
    setSilenceGain,
    setSustainGain,
    silenceGain,
    sustainGain,
  };
}

export default useEnvelopeControl;
