import { AudioLines } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  AmplitudeModulationConfig,
  DelayModulationConfig,
  FrequencyModulationConfig,
  PhaseModulationConfig,
} from '../../../../types';
import AmplitudeModulationEffect from './AmplitudeModulationEffect';
import DelayModulationEffect from './DelayModulationEffect';
import FrequencyModulationEffect from './FrequencyModulationEffect';
import PhaseModulationEffect from './PhaseModulationEffect';

interface ModulationProps {
  amplitudeModulation: AmplitudeModulationConfig | null;
  delayModulation: DelayModulationConfig | null;
  frequencyModulation: FrequencyModulationConfig | null;
  onAmplitudeModulationDepthChange: (value: number) => void;
  onAmplitudeModulationEnabledChange: (enabled: boolean) => void;
  onAmplitudeModulationFrequencyChange: (value: number) => void;
  onDelayModulationDepthChange: (value: number) => void;
  onDelayModulationEnabledChange: (enabled: boolean) => void;
  onDelayModulationFrequencyChange: (value: number) => void;
  onFrequencyModulationDepthChange: (value: number) => void;
  onFrequencyModulationEnabledChange: (enabled: boolean) => void;
  onFrequencyModulationFrequencyChange: (value: number) => void;
  onPhaseModulationDepthChange: (value: number) => void;
  onPhaseModulationEnabledChange: (enabled: boolean) => void;
  onPhaseModulationFrequencyChange: (value: number) => void;
  phaseModulation: PhaseModulationConfig | null;
}

function Modulation({
  amplitudeModulation,
  frequencyModulation,
  phaseModulation,
  delayModulation,
  onAmplitudeModulationEnabledChange,
  onAmplitudeModulationFrequencyChange,
  onAmplitudeModulationDepthChange,
  onFrequencyModulationEnabledChange,
  onFrequencyModulationFrequencyChange,
  onFrequencyModulationDepthChange,
  onPhaseModulationEnabledChange,
  onPhaseModulationFrequencyChange,
  onPhaseModulationDepthChange,
  onDelayModulationEnabledChange,
  onDelayModulationFrequencyChange,
  onDelayModulationDepthChange,
}: ModulationProps) {
  const { t } = useTranslation('synth');

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
