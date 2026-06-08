import { useTranslation } from 'react-i18next';
import { Activity, AudioWaveform } from 'lucide-react';
import { InlineMath } from 'react-katex';
import type { TremoloConfig, VibratoConfig } from '../../../../types';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';

interface ModulationProps {
  tremolo: TremoloConfig | null;
  vibrato: VibratoConfig | null;
  onTremoloEnabledChange: (enabled: boolean) => void;
  onTremoloFrequencyChange: (value: number) => void;
  onTremoloDepthChange: (value: number) => void;
  onVibratoEnabledChange: (enabled: boolean) => void;
  onVibratoFrequencyChange: (value: number) => void;
  onVibratoDepthChange: (value: number) => void;
}

function Modulation({
  tremolo,
  vibrato,
  onTremoloEnabledChange,
  onTremoloFrequencyChange,
  onTremoloDepthChange,
  onVibratoEnabledChange,
  onVibratoFrequencyChange,
  onVibratoDepthChange,
}: ModulationProps) {
  const { t } = useTranslation('synth');

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.modulation.name')}
      </summary>

      <div className="space-y-4">
        <section className="space-y-2">
          <h3 className="font-semibold">{t('effect.modulation.tremolo')}</h3>
          <ControlButton
            title={t('effect.modulation.tremoloEnabled')}
            icon={<Activity size={18} />}
            label={t(
              tremolo
                ? 'effect.modulation.tremoloDisabled'
                : 'effect.modulation.tremoloEnabled',
            )}
            onClick={() => onTremoloEnabledChange(!tremolo)}
          />

          {tremolo && (
            <div className="space-y-2">
              <BlockMath
                math={String.raw`g_y(t)=[1-\frac{d}{2}+\frac{d}{2}\sin(2\pi f_m t)]g_x(t)`}
              />
              <ControlRange
                label={t('effect.modulation.frequency')}
                symbol={<InlineMath math="f_m" />}
                min="0.1"
                max="20"
                step="0.1"
                value={tremolo.frequency}
                displayValue={`${tremolo.frequency.toFixed(1)} Hz`}
                onChange={onTremoloFrequencyChange}
              />
              <ControlRange
                label={t('effect.modulation.depth')}
                symbol={<InlineMath math="d" />}
                min="0"
                max="1"
                step="0.01"
                value={tremolo.depth}
                displayValue={`${(tremolo.depth * 100).toFixed(0)}%`}
                onChange={onTremoloDepthChange}
              />
            </div>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">{t('effect.modulation.vibrato')}</h3>

          <ControlButton
            title={t('effect.modulation.vibratoEnabled')}
            icon={<AudioWaveform size={18} />}
            label={t(
              vibrato
                ? 'effect.modulation.vibratoDisabled'
                : 'effect.modulation.vibratoEnabled',
            )}
            onClick={() => onVibratoEnabledChange(!vibrato)}
          />

          {vibrato && (
            <div className="space-y-2">
              <BlockMath
                math={String.raw`f_y(t)=[1 + (2^{c/1200}-1)\sin(2\pi f_m t)]f_x(t)`}
              />
              <ControlRange
                label={t('effect.modulation.frequency')}
                symbol={<InlineMath math="f_m" />}
                min="0.1"
                max="20"
                step="0.1"
                value={vibrato.frequency}
                displayValue={`${vibrato.frequency.toFixed(1)} Hz`}
                onChange={onVibratoFrequencyChange}
              />
              <ControlRange
                label={t('effect.modulation.depth')}
                symbol={<InlineMath math="c" />}
                min="0"
                max="100"
                step="1"
                value={vibrato.depth}
                displayValue={`${vibrato.depth.toFixed(0)} ¢`}
                onChange={onVibratoDepthChange}
              />
            </div>
          )}
        </section>
      </div>
    </details>
  );
}

export default Modulation;
