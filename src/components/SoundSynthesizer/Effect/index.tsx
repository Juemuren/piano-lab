import useEffectControl from '../../../hooks/synth/useEffectControl';
import type { EffectConfig } from '../../../types';
import Compressor from './Compressor';
import FilterAndEqualizer from './FilterAndEqualizer';
import Modulation from './Modulation';
import Panner from './Panner';
import Reverb from './Reverb';
import WaveShaper from './WaveShaper';

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
    amplitudeModulation,
    updateAmplitudeModulationEnabled,
    updateAmplitudeModulationFrequency,
    updateAmplitudeModulationDepth,
    frequencyModulation,
    updateFrequencyModulationEnabled,
    updateFrequencyModulationFrequency,
    updateFrequencyModulationDepth,
    phaseModulation,
    updatePhaseModulationEnabled,
    updatePhaseModulationFrequency,
    updatePhaseModulationDepth,
    delayModulation,
    updateDelayModulationEnabled,
    updateDelayModulationFrequency,
    updateDelayModulationDepth,
    waveShaper,
    updateWaveShaperEnabled,
    updateWaveShaperPreset,
    updateWaveShaperValue,
    compressor,
    updateCompressorEnabled,
    updateCompressorThreshold,
    updateCompressorKnee,
    updateCompressorRatio,
    updateCompressorAttack,
    updateCompressorRelease,
    panner,
    updatePannerEnabled,
    updatePannerValue,
    reverb,
    updateReverbEnabled,
    updateReverbPreset,
    updateReverbMix,
    addReverbEarlyReflection,
    removeReverbEarlyReflection,
    updateReverbEarlyReflectionDelay,
    updateReverbEarlyReflectionGain,
    updateReverbEarlyReflectionPhase,
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
      <Modulation
        amplitudeModulation={amplitudeModulation}
        frequencyModulation={frequencyModulation}
        phaseModulation={phaseModulation}
        delayModulation={delayModulation}
        onAmplitudeModulationEnabledChange={updateAmplitudeModulationEnabled}
        onAmplitudeModulationFrequencyChange={
          updateAmplitudeModulationFrequency
        }
        onAmplitudeModulationDepthChange={updateAmplitudeModulationDepth}
        onFrequencyModulationEnabledChange={updateFrequencyModulationEnabled}
        onFrequencyModulationFrequencyChange={
          updateFrequencyModulationFrequency
        }
        onFrequencyModulationDepthChange={updateFrequencyModulationDepth}
        onPhaseModulationEnabledChange={updatePhaseModulationEnabled}
        onPhaseModulationFrequencyChange={updatePhaseModulationFrequency}
        onPhaseModulationDepthChange={updatePhaseModulationDepth}
        onDelayModulationEnabledChange={updateDelayModulationEnabled}
        onDelayModulationFrequencyChange={updateDelayModulationFrequency}
        onDelayModulationDepthChange={updateDelayModulationDepth}
      />
      <WaveShaper
        waveShaper={waveShaper}
        onEnabledChange={updateWaveShaperEnabled}
        onPresetChange={updateWaveShaperPreset}
        onValueChange={updateWaveShaperValue}
      />
      <Compressor
        compressor={compressor}
        onEnabledChange={updateCompressorEnabled}
        onThresholdChange={updateCompressorThreshold}
        onKneeChange={updateCompressorKnee}
        onRatioChange={updateCompressorRatio}
        onAttackChange={updateCompressorAttack}
        onReleaseChange={updateCompressorRelease}
      />
      <Panner
        panner={panner}
        onEnabledChange={updatePannerEnabled}
        onValueChange={updatePannerValue}
      />
      <Reverb
        reverb={reverb}
        onEnabledChange={updateReverbEnabled}
        onPresetChange={updateReverbPreset}
        onMixChange={updateReverbMix}
        onEarlyReflectionAdd={addReverbEarlyReflection}
        onEarlyReflectionRemove={removeReverbEarlyReflection}
        onEarlyReflectionDelayChange={updateReverbEarlyReflectionDelay}
        onEarlyReflectionGainChange={updateReverbEarlyReflectionGain}
        onEarlyReflectionPhaseChange={updateReverbEarlyReflectionPhase}
        onLateTailDelayChange={updateReverbLateTailDelay}
        onLateTailDurationChange={updateReverbLateTailDuration}
        onLateTailAmplitudeChange={updateReverbLateTailAmplitude}
        onLateTailAlphaChange={updateReverbLateTailAlpha}
      />
    </>
  );
}

export default Effect;
