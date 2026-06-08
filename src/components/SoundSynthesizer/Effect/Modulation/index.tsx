import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioLines } from 'lucide-react';
import { InlineMath } from 'react-katex';
import type {
  DelayModulationConfig,
  PhaseModulationConfig,
  TremoloConfig,
  VibratoConfig,
} from '../../../../types';
import {
  getDelayModulationCurvePoints,
  getPhaseModulationCurvePoints,
  getTremoloCurvePoints,
  getVibratoCurvePoints,
} from '../../../../services/synth/effect/Modulation';
import BlockMath from '../../../shared/BlockMath';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ModulationCurvePreview from './ModulationCurvePreview';

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
  const tremoloCurve = useMemo(
    () => (tremolo ? getTremoloCurvePoints(tremolo) : null),
    [tremolo],
  );
  const vibratoCurve = useMemo(
    () => (vibrato ? getVibratoCurvePoints(vibrato) : null),
    [vibrato],
  );
  const phaseModulationCurve = useMemo(
    () =>
      phaseModulation ? getPhaseModulationCurvePoints(phaseModulation) : null,
    [phaseModulation],
  );
  const delayModulationCurve = useMemo(
    () =>
      delayModulation ? getDelayModulationCurvePoints(delayModulation) : null,
    [delayModulation],
  );

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.modulation.name')}
      </summary>

      <div className="space-y-4">
        <details open className="space-y-2">
          <summary className="font-semibold">
            {t('effect.modulation.tremolo')}
          </summary>

          <ControlButton
            title={t('effect.modulation.tremoloEnabled')}
            icon={<AudioLines size={18} />}
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
                math={String.raw`A_y(t)=[1-\frac{d}{2}+\frac{d}{2}\sin(2\pi f_m t)]A_x(t)`}
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
              {tremoloCurve && (
                <ModulationCurvePreview
                  title={t('effect.modulation.amplitudeCurve')}
                  time={tremoloCurve.time}
                  values={tremoloCurve.gainRatio}
                />
              )}
            </div>
          )}
        </details>

        <details open className="space-y-2">
          <summary className="font-semibold">
            {t('effect.modulation.vibrato')}
          </summary>

          <ControlButton
            title={t('effect.modulation.vibratoEnabled')}
            icon={<AudioLines size={18} />}
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
              {vibratoCurve && (
                <ModulationCurvePreview
                  title={t('effect.modulation.frequencyCurve')}
                  time={vibratoCurve.time}
                  values={vibratoCurve.frequencyRatio}
                />
              )}
            </div>
          )}
        </details>

        <details open className="space-y-2">
          <summary className="font-semibold">
            {t('effect.modulation.phaseModulation')}
          </summary>

          <ControlButton
            title={t('effect.modulation.phaseModulationEnabled')}
            icon={<AudioLines size={18} />}
            label={t(
              phaseModulation
                ? 'effect.modulation.phaseModulationDisabled'
                : 'effect.modulation.phaseModulationEnabled',
            )}
            onClick={() => onPhaseModulationEnabledChange(!phaseModulation)}
          />

          {phaseModulation && (
            <div className="space-y-2">
              <BlockMath
                math={String.raw`\phi_y(t)=\phi_x(t)+d\sin(2\pi f_m t)`}
              />
              <ControlRange
                label={t('effect.modulation.frequency')}
                symbol={<InlineMath math="f_m" />}
                min="0.1"
                max="10"
                step="0.1"
                value={phaseModulation.frequency}
                displayValue={`${phaseModulation.frequency.toFixed(1)} Hz`}
                onChange={onPhaseModulationFrequencyChange}
              />
              <ControlRange
                label={t('effect.modulation.depth')}
                symbol={<InlineMath math="d" />}
                min="0"
                max="1"
                step="0.01"
                value={phaseModulation.depth}
                displayValue={`${(phaseModulation.depth * 100).toFixed(0)}%`}
                onChange={onPhaseModulationDepthChange}
              />
              {phaseModulationCurve && (
                <ModulationCurvePreview
                  title={t('effect.modulation.phaseCurve')}
                  time={phaseModulationCurve.time}
                  values={phaseModulationCurve.phaseRatio}
                />
              )}
            </div>
          )}
        </details>

        <details open className="space-y-2">
          <summary className="font-semibold">
            {t('effect.modulation.delayModulation')}
          </summary>

          <ControlButton
            title={t('effect.modulation.delayModulationEnabled')}
            icon={<AudioLines size={18} />}
            label={t(
              delayModulation
                ? 'effect.modulation.delayModulationDisabled'
                : 'effect.modulation.delayModulationEnabled',
            )}
            onClick={() => onDelayModulationEnabledChange(!delayModulation)}
          />

          {delayModulation && (
            <div className="space-y-2">
              <BlockMath
                math={String.raw`\tau_y(t)=\frac{d}{2}+\frac{d}{2}\sin(2\pi f_m t)`}
              />
              <ControlRange
                label={t('effect.modulation.frequency')}
                symbol={<InlineMath math="f_m" />}
                min="0.1"
                max="10"
                step="0.1"
                value={delayModulation.frequency}
                displayValue={`${delayModulation.frequency.toFixed(1)} Hz`}
                onChange={onDelayModulationFrequencyChange}
              />
              <ControlRange
                label={t('effect.modulation.depth')}
                symbol={<InlineMath math="d" />}
                min="0"
                max="0.02"
                step="0.001"
                value={delayModulation.depth}
                displayValue={`${(delayModulation.depth * 1000).toFixed(0)} ms`}
                onChange={onDelayModulationDepthChange}
              />
              {delayModulationCurve && (
                <ModulationCurvePreview
                  title={t('effect.modulation.delayCurve')}
                  time={delayModulationCurve.time}
                  values={delayModulationCurve.delaySeconds}
                />
              )}
            </div>
          )}
        </details>
      </div>
    </details>
  );
}

export default Modulation;
