import { useTranslation } from 'react-i18next';
import type {
  DelayModulationConfig,
  PhaseModulationConfig,
  TremoloConfig,
  VibratoConfig,
} from '../../../../types';
import DelayModulationEffect from './DelayModulationEffect';
import PhaseModulationEffect from './PhaseModulationEffect';
import TremoloEffect from './TremoloEffect';
import VibratoEffect from './VibratoEffect';

interface ModulationProps {
  tremolo: TremoloConfig | null;
  vibrato: VibratoConfig | null;
  phaseModulation: PhaseModulationConfig | null;
  delayModulation: DelayModulationConfig | null;
  onTremoloEnabledChange: (enabled: boolean) => void;
  onTremoloFrequencyChange: (value: number) => void;
  onTremoloDepthChange: (value: number) => void;
  onVibratoEnabledChange: (enabled: boolean) => void;
  onVibratoFrequencyChange: (value: number) => void;
  onVibratoDepthChange: (value: number) => void;
  onPhaseModulationEnabledChange: (enabled: boolean) => void;
  onPhaseModulationFrequencyChange: (value: number) => void;
  onPhaseModulationDepthChange: (value: number) => void;
  onDelayModulationEnabledChange: (enabled: boolean) => void;
  onDelayModulationFrequencyChange: (value: number) => void;
  onDelayModulationDepthChange: (value: number) => void;
}

function Modulation({
  tremolo,
  vibrato,
  phaseModulation,
  delayModulation,
  onTremoloEnabledChange,
  onTremoloFrequencyChange,
  onTremoloDepthChange,
  onVibratoEnabledChange,
  onVibratoFrequencyChange,
  onVibratoDepthChange,
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
        {t('effect.modulation.name')}
      </summary>

      <div className="space-y-4">
        <TremoloEffect
          tremolo={tremolo}
          onEnabledChange={onTremoloEnabledChange}
          onFrequencyChange={onTremoloFrequencyChange}
          onDepthChange={onTremoloDepthChange}
        />
        <VibratoEffect
          vibrato={vibrato}
          onEnabledChange={onVibratoEnabledChange}
          onFrequencyChange={onVibratoFrequencyChange}
          onDepthChange={onVibratoDepthChange}
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
