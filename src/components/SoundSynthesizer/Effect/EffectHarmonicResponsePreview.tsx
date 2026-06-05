import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EqualizerEffectConfig, FilterEffectConfig } from '../../../types';
import { getBaseFrequency } from '../../../services/synth/SynthCalculations';
import {
  getBiquadEffectMagnitudes,
  RESPONSE_NYQUIST_FREQUENCY,
} from '../../../services/synth/EffectResponse';
import useBaseFrequencyOptions from '../../../hooks/synth/useBaseFrequencyOptions';
import { getHarmonicLabels } from '../../../utils/harmonic';
import VerticalSliderGroup from '../../shared/VerticalSliderGroup';
import BaseFrequencyControl from './BaseFrequencyControl';

interface EffectHarmonicResponsePreviewProps {
  title: string;
  harmonicCount: number;
  filters: FilterEffectConfig[];
  equalizers: EqualizerEffectConfig[];
}

const DEFAULT_EFFECT_PREVIEW_PITCH = 69;

function EffectHarmonicResponsePreview({
  title,
  harmonicCount,
  filters,
  equalizers,
}: EffectHarmonicResponsePreviewProps) {
  const { t } = useTranslation('synth');
  const [baseFrequency, setBaseFrequency] = useState(() =>
    getBaseFrequency(DEFAULT_EFFECT_PREVIEW_PITCH),
  );
  const { selectedPitch, baseFrequencyPitchOptions } =
    useBaseFrequencyOptions(baseFrequency);

  const harmonicFrequencies = useMemo(
    () =>
      Array.from(
        { length: harmonicCount },
        (_, index) => baseFrequency * (index + 1),
      ),
    [baseFrequency, harmonicCount],
  );
  const harmonicMagnitudes = useMemo(
    () =>
      getBiquadEffectMagnitudes(harmonicFrequencies, [
        ...filters,
        ...equalizers,
      ]),
    [equalizers, filters, harmonicFrequencies],
  );
  const isHarmonicFrequencySupported = useMemo(
    () =>
      harmonicFrequencies.map(
        (frequency) =>
          Number.isFinite(frequency) && frequency <= RESPONSE_NYQUIST_FREQUENCY,
      ),
    [harmonicFrequencies],
  );
  const maxMagnitude = useMemo(
    () => Math.max(1, Math.max(...harmonicMagnitudes)),
    [harmonicMagnitudes],
  );

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">{title}</summary>
      <BaseFrequencyControl
        labelRange={t('effect.preview.baseFrequency')}
        labelSelect={t('effect.preview.pitch')}
        value={baseFrequency}
        selectedPitch={selectedPitch}
        pitchOptions={baseFrequencyPitchOptions}
        getBaseFrequency={getBaseFrequency}
        onChange={setBaseFrequency}
      />
      <VerticalSliderGroup
        values={harmonicMagnitudes}
        labels={getHarmonicLabels(harmonicCount)}
        min="0"
        max={maxMagnitude}
        step="0.01"
        formatValue={(value, index) =>
          isHarmonicFrequencySupported[index] ? value.toFixed(2) : '--'
        }
        disabled
      />
    </details>
  );
}

export default EffectHarmonicResponsePreview;
