import { ArrowLeftRight, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import type { ReverbEarlyReflectionConfig } from '../../../../services/synth/effect/Reverb';
import type { IndexedConfigValueChangeHandler } from '../../../../types/config';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';

interface EarlyReflectionsProps {
  earlyReflections: ReverbEarlyReflectionConfig[];
  onAdd: () => void;
  onChange: IndexedConfigValueChangeHandler<ReverbEarlyReflectionConfig>;
  onRemove: (index: number) => void;
}

function EarlyReflections({
  earlyReflections,
  onAdd,
  onChange,
  onRemove,
}: EarlyReflectionsProps) {
  const { t } = useTranslation('synth');

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold">
        <span className="inline-flex items-center gap-1">
          <ArrowLeftRight size={16} />
          {t('effect.reverb.earlyReflection.name')}
        </span>
      </summary>
      <BlockMath
        math={String.raw`h_e[n]=\sum_i a_i\cos(\phi_i)\delta[n-d_if_s]`}
      />
      <div className="space-y-3">
        {earlyReflections.map((reflection, index) => (
          <div className="space-y-2" key={index}>
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
              <ControlButton
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
                title={t('effect.reverb.earlyReflection.name')}
              />
              <div className="text-left font-semibold text-sm">
                {t('effect.reverb.earlyReflection.item', {
                  index: index + 1,
                })}
              </div>
            </div>
            <div className="grid sm:grid-cols-3">
              <ControlRange
                {...SYNTH_CONFIG_RANGES.effect.reverb.earlyReflection.delay}
                displayValue={`${(reflection.delay * 1000).toFixed(0)} ms`}
                label={t('effect.reverb.earlyReflection.delay')}
                onChange={(value) => onChange(index, 'delay', value)}
                step="0.001"
                symbol={<InlineMath math="d_i" />}
                value={reflection.delay}
              />
              <ControlRange
                {...SYNTH_CONFIG_RANGES.effect.reverb.earlyReflection.gain}
                displayValue={reflection.gain.toFixed(2)}
                label={t('effect.reverb.earlyReflection.amplitude')}
                onChange={(value) => onChange(index, 'gain', value)}
                step="0.01"
                symbol={<InlineMath math="a_i" />}
                value={reflection.gain}
              />
              <ControlRange
                {...SYNTH_CONFIG_RANGES.effect.reverb.earlyReflection.phase}
                displayValue={`${reflection.phase.toFixed(0)}°`}
                label={t('effect.reverb.earlyReflection.phase')}
                onChange={(value) => onChange(index, 'phase', value)}
                step="1"
                symbol={<InlineMath math="\phi_i" />}
                value={reflection.phase}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
          <ControlButton
            icon={<Plus size={18} />}
            onClick={onAdd}
            title={t('effect.reverb.earlyReflection.name')}
          />
          <div className="text-left font-semibold text-sm">
            {t('effect.reverb.earlyReflection.item', {
              index: earlyReflections.length + 1,
            })}
          </div>
        </div>
      </div>
    </details>
  );
}

export default EarlyReflections;
