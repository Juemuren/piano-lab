import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import type { TimbreType } from '../types';
import { AudioEngine } from '../services/audio/AudioEngine';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import ControlRange from './shared/ControlRange';
import VerticalSliderGroup from './shared/VerticalSliderGroup';
import { getHarmonicLabels } from '../utils/harmonic';
import useTimbreControl from '../hooks/useTimbreControl';

const TIMBRE_FORMULAS: Record<TimbreType, string> = {
  metallic: String.raw`A_n \propto \frac1n`,
  pure: String.raw`A_n \propto \frac1{n^2}`,
  bright: String.raw`A_n \propto \frac1n \left|\sin\frac{n\pi}2\right|`,
  ethereal: String.raw`A_n \propto \frac{1}{n^2} \left|\sin\frac{n\pi}2\right|`,
  normal: String.raw`A_n \propto \frac1{n^2} \left|\sin(n\pi\lambda)\right|`,
  soft: String.raw`A_n \propto e^{-\sigma n}`,
  realistic: String.raw`A_n \propto \frac1{n^p} e^{-\sigma n}`,
  custom: String.raw`A_n = \text{custom}`,
};

interface TimbreAdjusterProps {
  audioEngine: AudioEngine;
  harmonicCount: number;
}

function TimbreAdjuster({ audioEngine, harmonicCount }: TimbreAdjusterProps) {
  const { t } = useTranslation('piano');
  const {
    lambda,
    sigma,
    p,
    timbre,
    handlePresetChange,
    handleParamsChange,
    handleAmplitudeChange,
  } = useTimbreControl(audioEngine, harmonicCount);

  const harmonicLabels = getHarmonicLabels(timbre.amplitudes.length);

  return (
    <ControlPanel>
      <ControlSelect
        value={timbre.type}
        onChange={(e) => {
          handlePresetChange(e.target.value as TimbreType);
        }}
      >
        <option value="metallic">{t('timbre.metallic')}</option>
        <option value="pure">{t('timbre.pure')}</option>
        <option value="bright">{t('timbre.bright')}</option>
        <option value="ethereal">{t('timbre.ethereal')}</option>
        <option value="normal">{t('timbre.normal')}</option>
        <option value="soft">{t('timbre.soft')}</option>
        <option value="realistic">{t('timbre.realistic')}</option>
        <option value="custom">{t('timbre.custom')}</option>
      </ControlSelect>

      {timbre.type !== 'custom' && (
        <BlockMath math={TIMBRE_FORMULAS[timbre.type]} />
      )}

      {timbre.type === 'normal' && (
        <ControlRange
          label={t('controls.strikePoint')}
          symbol={<InlineMath math="\lambda" />}
          min="0"
          max="1"
          step="0.01"
          value={lambda}
          displayValue={lambda.toFixed(2)}
          onChange={(value) => handleParamsChange({ lambda: value })}
        />
      )}

      {(timbre.type === 'soft' || timbre.type === 'realistic') && (
        <ControlRange
          label={t('controls.decayRate')}
          symbol={<InlineMath math="\sigma" />}
          min="0.01"
          max="1"
          step="0.01"
          value={sigma}
          displayValue={sigma.toFixed(2)}
          onChange={(value) => handleParamsChange({ sigma: value })}
        />
      )}

      {timbre.type === 'realistic' && (
        <ControlRange
          label={t('controls.powerExponent')}
          symbol={<InlineMath math="p" />}
          min="0.5"
          max="4"
          step="0.1"
          value={p}
          displayValue={p.toFixed(2)}
          onChange={(value) => handleParamsChange({ p: value })}
        />
      )}

      <VerticalSliderGroup
        values={timbre.amplitudes}
        labels={harmonicLabels}
        min="0"
        max="1"
        step="0.01"
        onChange={handleAmplitudeChange}
      />
    </ControlPanel>
  );
}

export default TimbreAdjuster;
