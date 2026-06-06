import type { EffectConfig } from '../../../types';
import useEffectControl from '../../../hooks/synth/useEffectControl';
import FilterAndEqualizer from './FilterAndEqualizer';
import Reverb from './Reverb';

interface EffectProps {
  harmonicCount: number;
  initialConfig?: EffectConfig | null;
  onConfigChange?: (config: EffectConfig) => void;
}

function Effect({ harmonicCount, initialConfig, onConfigChange }: EffectProps) {
  const {
    filters,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterFrequency,
    updateFilterQ,
    equalizers,
    addEqualizer,
    removeEqualizer,
    updateEqualizerType,
    updateEqualizerFrequency,
    updateEqualizerQ,
    updateEqualizerGain,
    reverb,
    updateReverbPreset,
    updateReverbMix,
    addReverbEarlyReflection,
    removeReverbEarlyReflection,
    updateReverbEarlyReflectionDelay,
    updateReverbEarlyReflectionGain,
    updateReverbLateTailDelay,
    updateReverbLateTailDuration,
    updateReverbLateTailAmplitude,
    updateReverbLateTailAlpha,
  } = useEffectControl(initialConfig, onConfigChange);

  return (
    <>
      <FilterAndEqualizer
        harmonicCount={harmonicCount}
        filters={filters}
        onFilterAdd={addFilter}
        onFilterRemove={removeFilter}
        onFilterTypeChange={updateFilterType}
        onFilterFrequencyChange={updateFilterFrequency}
        onFilterQChange={updateFilterQ}
        equalizers={equalizers}
        onEqualizerAdd={addEqualizer}
        onEqualizerRemove={removeEqualizer}
        onEqualizerTypeChange={updateEqualizerType}
        onEqualizerFrequencyChange={updateEqualizerFrequency}
        onEqualizerQChange={updateEqualizerQ}
        onEqualizerGainChange={updateEqualizerGain}
      />
      <Reverb
        reverb={reverb}
        onPresetChange={updateReverbPreset}
        onMixChange={updateReverbMix}
        onEarlyReflectionAdd={addReverbEarlyReflection}
        onEarlyReflectionRemove={removeReverbEarlyReflection}
        onEarlyReflectionDelayChange={updateReverbEarlyReflectionDelay}
        onEarlyReflectionGainChange={updateReverbEarlyReflectionGain}
        onLateTailDelayChange={updateReverbLateTailDelay}
        onLateTailDurationChange={updateReverbLateTailDuration}
        onLateTailAmplitudeChange={updateReverbLateTailAmplitude}
        onLateTailAlphaChange={updateReverbLateTailAlpha}
      />
    </>
  );
}

export default Effect;
