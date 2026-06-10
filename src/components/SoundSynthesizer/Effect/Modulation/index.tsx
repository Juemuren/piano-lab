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
  frequencyModulation: FrequencyModulationConfig | null;
  phaseModulation: PhaseModulationConfig | null;
  delayModulation: DelayModulationConfig | null;
  onAmplitudeModulationEnabledChange: (enabled: boolean) => void;
  onAmplitudeModulationFrequencyChange: (value: number) => void;
  onAmplitudeModulationDepthChange: (value: number) => void;
  onFrequencyModulationEnabledChange: (enabled: boolean) => void;
  onFrequencyModulationFrequencyChange: (value: number) => void;
  onFrequencyModulationDepthChange: (value: number) => void;
  onPhaseModulationEnabledChange: (enabled: boolean) => void;
  onPhaseModulationFrequencyChange: (value: number) => void;
  onPhaseModulationDepthChange: (value: number) => void;
  onDelayModulationEnabledChange: (enabled: boolean) => void;
  onDelayModulationFrequencyChange: (value: number) => void;
  onDelayModulationDepthChange: (value: number) => void;
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
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <AudioLines size={18} />
          {t('effect.modulation.name')}
        </span>
      </summary>

      <div className="space-y-4">
        <AmplitudeModulationEffect
          amplitudeModulation={amplitudeModulation}
          onEnabledChange={onAmplitudeModulationEnabledChange}
          onFrequencyChange={onAmplitudeModulationFrequencyChange}
          onDepthChange={onAmplitudeModulationDepthChange}
        />
        <FrequencyModulationEffect
          frequencyModulation={frequencyModulation}
          onEnabledChange={onFrequencyModulationEnabledChange}
          onFrequencyChange={onFrequencyModulationFrequencyChange}
          onDepthChange={onFrequencyModulationDepthChange}
        />
        <PhaseModulationEffect
          phaseModulation={phaseModulation}
          onEnabledChange={onPhaseModulationEnabledChange}
          onFrequencyChange={onPhaseModulationFrequencyChange}
          onDepthChange={onPhaseModulationDepthChange}
        />
        <DelayModulationEffect
          delayModulation={delayModulation}
          onEnabledChange={onDelayModulationEnabledChange}
          onFrequencyChange={onDelayModulationFrequencyChange}
          onDepthChange={onDelayModulationDepthChange}
        />
      </div>
    </details>
  );
}

export default Modulation;
