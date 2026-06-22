import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useBaseFrequencyOptions from '../../../../hooks/synth/useBaseFrequencyOptions';
import {
  FILTER_RESPONSE_NYQUIST_FREQUENCY,
  getBiquadMagnitudes,
} from '../../../../services/synth/effect/Filter';
import { getBaseFrequency } from '../../../../services/synth/VoicePlanner';
import type { EqualizerConfig, FilterConfig } from '../../../../types';
import VerticalSliderGroup from '../../../shared/VerticalSliderGroup';
import HarmonicLabel from '../../shared/HarmonicLabel';
import BaseFrequencyControl from './BaseFrequencyControl';

interface HarmonicResponsePreviewProps {
  title: string;
  harmonicCount: number;
  filters: FilterConfig[];
  equalizers: EqualizerConfig[];
}

const DEFAULT_EFFECT_PREVIEW_PITCH = 69;

function HarmonicResponsePreview({
  title,
  harmonicCount,
  filters,
  equalizers,
}: HarmonicResponsePreviewProps) {
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
    () => getBiquadMagnitudes(harmonicFrequencies, [...filters, ...equalizers]),
    [equalizers, filters, harmonicFrequencies],
  );
  const isHarmonicFrequencySupported = useMemo(
    () =>
      harmonicFrequencies.map(
        (frequency) =>
          Number.isFinite(frequency) &&
          frequency <= FILTER_RESPONSE_NYQUIST_FREQUENCY,
      ),
    [harmonicFrequencies],
  );
  const maxMagnitude = useMemo(
    () => Math.max(1, Math.max(...harmonicMagnitudes)),
    [harmonicMagnitudes],
  );

  return (
    <details open className="my-2">
      <summary className="font-bold my-2">{title}</summary>
      <BaseFrequencyControl
        labelRange={t('effect.filterEqualizer.baseFrequency')}
        labelSelect={t('effect.filterEqualizer.pitch')}
        value={baseFrequency}
        selectedPitch={selectedPitch}
        pitchOptions={baseFrequencyPitchOptions}
        getBaseFrequency={getBaseFrequency}
        onChange={setBaseFrequency}
      />
      <VerticalSliderGroup
        values={harmonicMagnitudes}
        labels={HarmonicLabel(harmonicCount)}
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

export default HarmonicResponsePreview;
