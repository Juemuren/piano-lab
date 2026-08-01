import useEffectControl from '../../../hooks/synth/useEffectControl';
import type { EffectConfig } from '../../../services/synth/EffectChain';
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
    compressorControl,
    filterEqualizerControl,
    modulationControl,
    pannerControl,
    reverbControl,
    waveShaperControl,
  } = useEffectControl(initialConfig, onConfigChange);

  return (
    <>
      <FilterAndEqualizer
        filterEqualizer={filterEqualizerControl.filterEqualizer}
        harmonicCount={harmonicCount}
        onEnabledChange={filterEqualizerControl.updateFilterEqualizerEnabled}
        onEqualizerAdd={filterEqualizerControl.addEqualizer}
        onEqualizerChange={filterEqualizerControl.updateEqualizer}
        onEqualizerRemove={filterEqualizerControl.removeEqualizer}
        onFilterAdd={filterEqualizerControl.addFilter}
        onFilterChange={filterEqualizerControl.updateFilter}
        onFilterRemove={filterEqualizerControl.removeFilter}
        onPresetChange={filterEqualizerControl.updateFilterEqualizerPreset}
      />
      <Reverb
        onEarlyReflectionAdd={reverbControl.addReverbEarlyReflection}
        onEarlyReflectionChange={reverbControl.updateReverbEarlyReflection}
        onEarlyReflectionRemove={reverbControl.removeReverbEarlyReflection}
        onEnabledChange={reverbControl.updateReverbEnabled}
        onLateTailChange={reverbControl.updateReverbLateTail}
        onMixChange={reverbControl.updateReverbMix}
        onPresetChange={reverbControl.updateReverbPreset}
        reverb={reverbControl.reverb}
      />
      <Modulation
        amplitudeModulation={modulationControl.amplitudeModulation}
        delayModulation={modulationControl.delayModulation}
        frequencyModulation={modulationControl.frequencyModulation}
        onAmplitudeModulationDepthChange={
          modulationControl.updateAmplitudeModulationDepth
        }
        onAmplitudeModulationEnabledChange={
          modulationControl.updateAmplitudeModulationEnabled
        }
        onAmplitudeModulationFrequencyChange={
          modulationControl.updateAmplitudeModulationFrequency
        }
        onDelayModulationDepthChange={
          modulationControl.updateDelayModulationDepth
        }
        onDelayModulationEnabledChange={
          modulationControl.updateDelayModulationEnabled
        }
        onDelayModulationFrequencyChange={
          modulationControl.updateDelayModulationFrequency
        }
        onFrequencyModulationDepthChange={
          modulationControl.updateFrequencyModulationDepth
        }
        onFrequencyModulationEnabledChange={
          modulationControl.updateFrequencyModulationEnabled
        }
        onFrequencyModulationFrequencyChange={
          modulationControl.updateFrequencyModulationFrequency
        }
        onPhaseModulationDepthChange={
          modulationControl.updatePhaseModulationDepth
        }
        onPhaseModulationEnabledChange={
          modulationControl.updatePhaseModulationEnabled
        }
        onPhaseModulationFrequencyChange={
          modulationControl.updatePhaseModulationFrequency
        }
        phaseModulation={modulationControl.phaseModulation}
      />
      <WaveShaper
        onEnabledChange={waveShaperControl.updateWaveShaperEnabled}
        onPresetChange={waveShaperControl.updateWaveShaperPreset}
        onValueChange={waveShaperControl.updateWaveShaperValue}
        waveShaper={waveShaperControl.waveShaper}
      />
      <Compressor
        compressor={compressorControl.compressor}
        onAttackChange={compressorControl.updateCompressorAttack}
        onEnabledChange={compressorControl.updateCompressorEnabled}
        onKneeChange={compressorControl.updateCompressorKnee}
        onRatioChange={compressorControl.updateCompressorRatio}
        onReleaseChange={compressorControl.updateCompressorRelease}
        onThresholdChange={compressorControl.updateCompressorThreshold}
      />
      <Panner
        onEnabledChange={pannerControl.updatePannerEnabled}
        onValueChange={pannerControl.updatePannerValue}
        panner={pannerControl.panner}
      />
    </>
  );
}

export default Effect;
