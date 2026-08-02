import { AudioLines } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AmplitudeModulationEffect from './AmplitudeModulationEffect';
import DelayModulationEffect from './DelayModulationEffect';
import FrequencyModulationEffect from './FrequencyModulationEffect';
import PhaseModulationEffect from './PhaseModulationEffect';

function Modulation() {
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
        <AmplitudeModulationEffect />
        <FrequencyModulationEffect />
        <PhaseModulationEffect />
        <DelayModulationEffect />
      </div>
    </details>
  );
}

export default Modulation;
