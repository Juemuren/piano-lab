import { AudioLines } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useModulationControl from '../../../../hooks/synth/effect/useModulationControl';
import AmplitudeModulationEffect from './AmplitudeModulationEffect';
import DelayModulationEffect from './DelayModulationEffect';
import FrequencyModulationEffect from './FrequencyModulationEffect';
import PhaseModulationEffect from './PhaseModulationEffect';

function Modulation() {
  const { t } = useTranslation('synth');
  const {
    amplitudeModulation,
    delayModulation,
    frequencyModulation,
    phaseModulation,
    updateAmplitudeModulationDepth: onAmplitudeModulationDepthChange,
    updateAmplitudeModulationEnabled: onAmplitudeModulationEnabledChange,
    updateAmplitudeModulationFrequency: onAmplitudeModulationFrequencyChange,
    updateDelayModulationDepth: onDelayModulationDepthChange,
    updateDelayModulationEnabled: onDelayModulationEnabledChange,
    updateDelayModulationFrequency: onDelayModulationFrequencyChange,
    updateFrequencyModulationDepth: onFrequencyModulationDepthChange,
    updateFrequencyModulationEnabled: onFrequencyModulationEnabledChange,
    updateFrequencyModulationFrequency: onFrequencyModulationFrequencyChange,
    updatePhaseModulationDepth: onPhaseModulationDepthChange,
    updatePhaseModulationEnabled: onPhaseModulationEnabledChange,
    updatePhaseModulationFrequency: onPhaseModulationFrequencyChange,
  } = useModulationControl();

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <AudioLines size={18} />
          {t('effect.modulation.name')}
        </span>
      </summary>

      <div className="space-y-4">
        <AmplitudeModulationEffect
          amplitudeModulation={amplitudeModulation}
          onDepthChange={onAmplitudeModulationDepthChange}
          onEnabledChange={onAmplitudeModulationEnabledChange}
          onFrequencyChange={onAmplitudeModulationFrequencyChange}
        />
        <FrequencyModulationEffect
          frequencyModulation={frequencyModulation}
          onDepthChange={onFrequencyModulationDepthChange}
          onEnabledChange={onFrequencyModulationEnabledChange}
          onFrequencyChange={onFrequencyModulationFrequencyChange}
        />
        <PhaseModulationEffect
          onDepthChange={onPhaseModulationDepthChange}
          onEnabledChange={onPhaseModulationEnabledChange}
          onFrequencyChange={onPhaseModulationFrequencyChange}
          phaseModulation={phaseModulation}
        />
        <DelayModulationEffect
          delayModulation={delayModulation}
          onDepthChange={onDelayModulationDepthChange}
          onEnabledChange={onDelayModulationEnabledChange}
          onFrequencyChange={onDelayModulationFrequencyChange}
        />
      </div>
    </details>
  );
}

export default Modulation;
