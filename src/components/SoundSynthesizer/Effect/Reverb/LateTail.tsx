import { Speaker } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import type { ReverbLateTailConfig } from '../../../../services/synth/effect/Reverb';
import type { ConfigValueChangeHandler } from '../../../../types/config';
import BlockMath from '../../../shared/BlockMath';
import ControlRange from '../../../shared/ControlRange';

interface LateTailProps {
  lateTail: ReverbLateTailConfig;
  onChange: ConfigValueChangeHandler<ReverbLateTailConfig>;
}

function LateTail({ lateTail, onChange }: LateTailProps) {
  const { t } = useTranslation('synth');

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">
        <span className="inline-flex items-center gap-1">
          <Speaker size={16} />
          {t('effect.reverb.lateTail.name')}
        </span>
      </summary>
      <BlockMath
        math={String.raw`h_l[n]=A\mathcal{N}(0,1)e^{-\alpha(n-Df_s)}`}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.effect.reverb.lateTail.delay}
        displayValue={`${(lateTail.delay * 1000).toFixed(0)} ms`}
        label={t('effect.reverb.lateTail.delay')}
        onChange={(value) => onChange('delay', value)}
        step="0.001"
        symbol={<InlineMath math="D" />}
        value={lateTail.delay}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.effect.reverb.lateTail.duration}
        displayValue={`${lateTail.duration.toFixed(2)} s`}
        label={t('effect.reverb.lateTail.duration')}
        onChange={(value) => onChange('duration', value)}
        step="0.01"
        symbol={<InlineMath math="T" />}
        value={lateTail.duration}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.effect.reverb.lateTail.amplitude}
        displayValue={lateTail.amplitude.toFixed(3)}
        label={t('effect.reverb.lateTail.amplitude')}
        onChange={(value) => onChange('amplitude', value)}
        step="0.001"
        symbol={<InlineMath math="A" />}
        value={lateTail.amplitude}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.effect.reverb.lateTail.alpha}
        displayValue={lateTail.alpha.toExponential(5)}
        label={t('effect.reverb.lateTail.alpha')}
        onChange={(value) => onChange('alpha', value)}
        step="0.00001"
        symbol={<InlineMath math="\alpha" />}
        value={lateTail.alpha}
      />
    </details>
  );
}

export default LateTail;
