import { useCallback, useMemo } from 'react';
import type { EnvelopeConfig } from '../../services/synth/Envelope';
import { useSynthConfigStore } from '../../stores/synthConfigStore';

const ENVELOPE_SUSTAIN_SECONDS = 1;
const ENVELOPE_POINTS_PER_SEGMENT = 50;

export interface EnvelopeCurve {
  gain: number[];
  maxTime: number;
  time: number[];
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
    const gain = startGain * (endGain / startGain) ** progress;

    return { gain, time };
  });
}

function useEnvelopeControl() {
  const envelopeConfig = useSynthConfigStore((state) => state.config.envelope);
  const setEnvelopeConfig = useSynthConfigStore(
    (state) => state.setEnvelopeConfig,
  );
  const { attackTime, decayTime, releaseTime, silenceGain, sustainGain } =
    envelopeConfig;
  const updateEnvelope = useCallback(
    <Key extends keyof EnvelopeConfig>(
      key: Key,
      value: EnvelopeConfig[Key],
    ) => {
      setEnvelopeConfig((current) => ({ ...current, [key]: value }));
    },
    [setEnvelopeConfig],
  );

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
    setAttackTime: (value: number) => updateEnvelope('attackTime', value),
    setDecayTime: (value: number) => updateEnvelope('decayTime', value),
    setReleaseTime: (value: number) => updateEnvelope('releaseTime', value),
    setSilenceGain: (value: number) => updateEnvelope('silenceGain', value),
    setSustainGain: (value: number) => updateEnvelope('sustainGain', value),
    silenceGain,
    sustainGain,
  };
}

export default useEnvelopeControl;
