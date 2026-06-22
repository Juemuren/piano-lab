import { ArrowLeftRight, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { ReverbEarlyReflectionConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';

interface EarlyReflectionsProps {
  earlyReflections: ReverbEarlyReflectionConfig[];
  onAdd: () => void;
  onDelayChange: (index: number, value: number) => void;
  onGainChange: (index: number, value: number) => void;
  onPhaseChange: (index: number, value: number) => void;
  onRemove: (index: number) => void;
}

function EarlyReflections({
  earlyReflections,
  onAdd,
  onRemove,
  onDelayChange,
  onGainChange,
  onPhaseChange,
}: EarlyReflectionsProps) {
  const { t } = useTranslation('synth');

  return (
    <details className="my-2" open>
      <summary className="font-bold my-2">
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
            <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
              <ControlButton
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
                title={t('effect.reverb.earlyReflection.name')}
              />
              <div className="text-left text-sm font-semibold">
                {t('effect.reverb.earlyReflection.item', {
                  index: index + 1,
                })}
              </div>
            </div>
            <div className="grid sm:grid-cols-3">
              <ControlRange
                displayValue={`${(reflection.delay * 1000).toFixed(0)} ms`}
                label={t('effect.reverb.earlyReflection.delay')}
                max="0.5"
                min="0"
                onChange={(value) => onDelayChange(index, value)}
                step="0.001"
                symbol={<InlineMath math="d_i" />}
                value={reflection.delay}
              />
              <ControlRange
                displayValue={reflection.gain.toFixed(2)}
                label={t('effect.reverb.earlyReflection.amplitude')}
                max="1"
                min="0"
                onChange={(value) => onGainChange(index, value)}
                step="0.01"
                symbol={<InlineMath math="a_i" />}
                value={reflection.gain}
              />
              <ControlRange
                displayValue={`${reflection.phase.toFixed(0)}°`}
                label={t('effect.reverb.earlyReflection.phase')}
                max="180"
                min="0"
                onChange={(value) => onPhaseChange(index, value)}
                step="1"
                symbol={<InlineMath math="\phi_i" />}
                value={reflection.phase}
              />
            </div>
          </div>
        ))}
        <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
          <ControlButton
            icon={<Plus size={18} />}
            onClick={onAdd}
            title={t('effect.reverb.earlyReflection.name')}
          />
          <div className="text-left text-sm font-semibold">
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
