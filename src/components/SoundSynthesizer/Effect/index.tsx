import useEffectControl from '../../../hooks/synth/useEffectControl';
import type { EffectConfig } from '../../../types/synth';
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
    filterEqualizer,
    updateFilterEqualizerEnabled,
    updateFilterEqualizerPreset,
    addFilter,
    removeFilter,
    updateFilterType,
    updateFilterFrequency,
    updateFilterQ,
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
        filterEqualizer={filterEqualizer}
        harmonicCount={harmonicCount}
        onEnabledChange={updateFilterEqualizerEnabled}
        onEqualizerAdd={addEqualizer}
        onEqualizerFrequencyChange={updateEqualizerFrequency}
        onEqualizerGainChange={updateEqualizerGain}
        onEqualizerQChange={updateEqualizerQ}
        onEqualizerRemove={removeEqualizer}
        onEqualizerTypeChange={updateEqualizerType}
        onFilterAdd={addFilter}
        onFilterFrequencyChange={updateFilterFrequency}
        onFilterQChange={updateFilterQ}
        onFilterRemove={removeFilter}
        onFilterTypeChange={updateFilterType}
        onPresetChange={updateFilterEqualizerPreset}
      />
      <Reverb
        onEarlyReflectionAdd={addReverbEarlyReflection}
        onEarlyReflectionDelayChange={updateReverbEarlyReflectionDelay}
        onEarlyReflectionGainChange={updateReverbEarlyReflectionGain}
        onEarlyReflectionPhaseChange={updateReverbEarlyReflectionPhase}
        onEarlyReflectionRemove={removeReverbEarlyReflection}
        onEnabledChange={updateReverbEnabled}
        onLateTailAlphaChange={updateReverbLateTailAlpha}
        onLateTailAmplitudeChange={updateReverbLateTailAmplitude}
        onLateTailDelayChange={updateReverbLateTailDelay}
        onLateTailDurationChange={updateReverbLateTailDuration}
        onMixChange={updateReverbMix}
        onPresetChange={updateReverbPreset}
        reverb={reverb}
      />
      <Modulation
        amplitudeModulation={amplitudeModulation}
        delayModulation={delayModulation}
        frequencyModulation={frequencyModulation}
        onAmplitudeModulationDepthChange={updateAmplitudeModulationDepth}
        onAmplitudeModulationEnabledChange={updateAmplitudeModulationEnabled}
        onAmplitudeModulationFrequencyChange={
          updateAmplitudeModulationFrequency
        }
        onDelayModulationDepthChange={updateDelayModulationDepth}
        onDelayModulationEnabledChange={updateDelayModulationEnabled}
        onDelayModulationFrequencyChange={updateDelayModulationFrequency}
        onFrequencyModulationDepthChange={updateFrequencyModulationDepth}
        onFrequencyModulationEnabledChange={updateFrequencyModulationEnabled}
        onFrequencyModulationFrequencyChange={
          updateFrequencyModulationFrequency
        }
        onPhaseModulationDepthChange={updatePhaseModulationDepth}
        onPhaseModulationEnabledChange={updatePhaseModulationEnabled}
        onPhaseModulationFrequencyChange={updatePhaseModulationFrequency}
        phaseModulation={phaseModulation}
      />
      <WaveShaper
        onEnabledChange={updateWaveShaperEnabled}
        onPresetChange={updateWaveShaperPreset}
        onValueChange={updateWaveShaperValue}
        waveShaper={waveShaper}
      />
      <Compressor
        compressor={compressor}
        onAttackChange={updateCompressorAttack}
        onEnabledChange={updateCompressorEnabled}
        onKneeChange={updateCompressorKnee}
        onRatioChange={updateCompressorRatio}
        onReleaseChange={updateCompressorRelease}
        onThresholdChange={updateCompressorThreshold}
      />
      <Panner
        onEnabledChange={updatePannerEnabled}
        onValueChange={updatePannerValue}
        panner={panner}
      />
    </>
  );
}

export default Effect;
