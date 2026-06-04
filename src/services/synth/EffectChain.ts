import type { EffectDefinition } from '../../types';
import {
  DEFAULT_EFFECT_ATTENUATION,
  DEFAULT_EFFECT_BASE_FREQUENCY_HZ,
  DEFAULT_EFFECT_DELAY_MS,
  DEFAULT_EFFECT_MAX_FREQUENCY_HZ,
  DEFAULT_EFFECT_MIN_FREQUENCY_HZ,
  DEFAULT_EFFECT_TYPE,
} from '../../constants';
import type { VoiceStartPlan } from './SynthCalculations';
import { getBaseFrequency, getDelaySeconds } from './SynthCalculations';
import { createEffect } from './SynthDefinitions';

interface HarmonicShapeOptions {
  pitch: number;
  cents: number;
  harmonics: number;
}

export class EffectChain {
  private definition: EffectDefinition = {
    type: DEFAULT_EFFECT_TYPE,
    tau: DEFAULT_EFFECT_DELAY_MS,
    alpha: DEFAULT_EFFECT_ATTENUATION,
    minFrequency: DEFAULT_EFFECT_MIN_FREQUENCY_HZ,
    maxFrequency: DEFAULT_EFFECT_MAX_FREQUENCY_HZ,
    baseFrequency: DEFAULT_EFFECT_BASE_FREQUENCY_HZ,
  };
  configure(definition: EffectDefinition) {
    this.definition = definition;
  }

  shapeHarmonics(
    plans: VoiceStartPlan[],
    { pitch, cents, harmonics }: HarmonicShapeOptions,
  ): VoiceStartPlan[] {
    const baseFrequency = getBaseFrequency(pitch, cents);
    const { magnitudes, phases } = createEffect(
      { ...this.definition, baseFrequency },
      harmonics,
    );

    return plans.map((plan) => {
      const magnitude = magnitudes[plan.harmonic - 1] || 0;
      const phaseDeg = phases[plan.harmonic - 1] || 0;
      const startTime = Math.max(
        0,
        plan.startTime + getDelaySeconds(phaseDeg, plan.frequency),
      );
      const attackTime = plan.attackEnd - plan.startTime;
      const decayTime = plan.decayEnd - plan.attackEnd;
      const attackEnd = startTime + attackTime;
      const decayEnd = attackEnd + decayTime;
      const attackGain = Math.max(
        plan.sourceGain * magnitude,
        plan.silenceGain,
      );
      const decayGain = Math.max(
        attackGain * plan.envelopeSustainGain,
        plan.silenceGain,
      );
      const sustainGain = Math.max(
        decayGain / Math.sqrt(1 + plan.harmonic),
        plan.silenceGain,
      );

      return {
        ...plan,
        startTime,
        attackEnd,
        decayEnd,
        attackGain,
        decayGain,
        sustainGain,
      };
    });
  }
}
