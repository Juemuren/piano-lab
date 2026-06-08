import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import { Minus, Plus } from 'lucide-react';
import type { ReverbEarlyReflectionConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';

interface EarlyReflectionsProps {
  earlyReflections: ReverbEarlyReflectionConfig[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onDelayChange: (index: number, value: number) => void;
  onGainChange: (index: number, value: number) => void;
  onPhaseChange: (index: number, value: number) => void;
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
    <details open className="my-2">
      <summary className="font-bold my-2">
        {t('effect.reverb.earlyReflection.name')}
      </summary>
      <BlockMath
        math={String.raw`h_e[n]=\sum_i a_i\cos(\phi_i)\delta[n-d_if_s]`}
      />
      <div className="space-y-3">
        {earlyReflections.map((reflection, index) => (
          <div key={index} className="space-y-2">
            <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
              <ControlButton
                title={t('effect.reverb.earlyReflection.name')}
                icon={<Minus size={18} />}
                onClick={() => onRemove(index)}
              />
              <div className="text-left text-sm font-semibold">
                {t('effect.reverb.earlyReflection.item', {
                  index: index + 1,
                })}
              </div>
            </div>
            <ControlRange
              label={t('effect.reverb.earlyReflection.delay')}
              symbol={<InlineMath math="d_i" />}
              min="0"
              max="0.5"
              step="0.001"
              value={reflection.delay}
              displayValue={`${(reflection.delay * 1000).toFixed(0)} ms`}
              onChange={(value) => onDelayChange(index, value)}
            />
            <ControlRange
              label={t('effect.reverb.earlyReflection.amplitude')}
              symbol={<InlineMath math="a_i" />}
              min="0"
              max="1"
              step="0.01"
              value={reflection.gain}
              displayValue={reflection.gain.toFixed(2)}
              onChange={(value) => onGainChange(index, value)}
            />
            <ControlRange
              label={t('effect.reverb.earlyReflection.phase')}
              symbol={<InlineMath math="\phi_i" />}
              min="0"
              max="180"
              step="1"
              value={reflection.phase}
              displayValue={`${reflection.phase.toFixed(0)}°`}
              onChange={(value) => onPhaseChange(index, value)}
            />
          </div>
        ))}
        <div className="grid gap-2 grid-cols-[auto_1fr] items-center">
          <ControlButton
            title={t('effect.reverb.earlyReflection.name')}
            icon={<Plus size={18} />}
            onClick={onAdd}
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
