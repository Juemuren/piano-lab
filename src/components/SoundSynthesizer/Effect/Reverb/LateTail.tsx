import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { ReverbLateTailConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlRange from '../../../shared/ControlRange';

interface LateTailProps {
  lateTail: ReverbLateTailConfig;
  onDelayChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onAmplitudeChange: (value: number) => void;
  onAlphaChange: (value: number) => void;
}

function LateTail({
  lateTail,
  onDelayChange,
  onDurationChange,
  onAmplitudeChange,
  onAlphaChange,
}: LateTailProps) {
  const { t } = useTranslation('synth');

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">
        {t('effect.reverb.lateTail.name')}
      </summary>
      <BlockMath
        math={String.raw`
          h_l[n]=A\left(\frac{1}{3}\sum_{k=0}^{\lfloor Tf_s \rceil - 1} e^{-2\alpha k}\right)^{-1/2}U[-1,1]e^{-\alpha(n-Df_s)}
        `}
      />
      <ControlRange
        label={t('effect.reverb.lateTail.delay')}
        symbol={<InlineMath math="D" />}
        min="0"
        max="1"
        step="0.001"
        value={lateTail.delay}
        displayValue={`${(lateTail.delay * 1000).toFixed(0)} ms`}
        onChange={onDelayChange}
      />
      <ControlRange
        label={t('effect.reverb.lateTail.duration')}
        symbol={<InlineMath math="T" />}
        min="0.1"
        max="8"
        step="0.01"
        value={lateTail.duration}
        displayValue={`${lateTail.duration.toFixed(2)} s`}
        onChange={onDurationChange}
      />
      <ControlRange
        label={t('effect.reverb.lateTail.amplitude')}
        symbol={<InlineMath math="A" />}
        min="0"
        max="1"
        step="0.01"
        value={lateTail.amplitude}
        displayValue={lateTail.amplitude.toFixed(2)}
        onChange={onAmplitudeChange}
      />
      <ControlRange
        label={t('effect.reverb.lateTail.alpha')}
        symbol={<InlineMath math="\alpha" />}
        min="0.00001"
        max="0.001"
        step="0.00001"
        value={lateTail.alpha}
        displayValue={lateTail.alpha.toFixed(5)}
        onChange={onAlphaChange}
      />
    </details>
  );
}

export default LateTail;
