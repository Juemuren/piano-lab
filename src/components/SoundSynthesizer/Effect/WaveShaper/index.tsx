import { AudioWaveform, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { WaveShaperPreset } from '../../../../services/synth/config/Options';
import { WAVE_SHAPER_PRESETS } from '../../../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import type { WaveShaperConfig } from '../../../../services/synth/effect/WaveShaper';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import WaveShaperCurvePreview from './WaveShaperCurvePreview';

interface WaveShaperProps {
  onEnabledChange: (enabled: boolean) => void;
  onPresetChange: (preset: WaveShaperPreset) => void;
  onValueChange: (
    key: Exclude<keyof WaveShaperConfig, 'preset'>,
    value: number,
  ) => void;
  waveShaper: WaveShaperConfig | null;
}

const presetParams: Record<
  WaveShaperPreset,
  {
    key: Exclude<keyof WaveShaperConfig, 'preset'>;
    symbol: string;
    min: number;
    max: number;
    step: number;
    formula: string;
  }
> = {
  distortion: {
    ...SYNTH_CONFIG_RANGES.effect.waveShaper.distortion,
    formula: String.raw`y=\tanh(gx)`,
    key: 'distortion',
    step: 0.1,
    symbol: 'g',
  },
  fuzz: {
    ...SYNTH_CONFIG_RANGES.effect.waveShaper.fuzz,
    formula: String.raw`y=\frac{2}{\pi}\arctan(sx)`,
    key: 'fuzz',
    step: 1,
    symbol: 's',
  },
  overdrive: {
    ...SYNTH_CONFIG_RANGES.effect.waveShaper.overdrive,
    formula: String.raw`y=\frac{\arctan(kx)}{\arctan(k)}`,
    key: 'overdrive',
    step: 0.1,
    symbol: 'k',
  },
  saturation: {
    ...SYNTH_CONFIG_RANGES.effect.waveShaper.saturation,
    formula: String.raw`y=\frac{x}{1+c|x|}`,
    key: 'saturation',
    step: 0.01,
    symbol: 'c',
  },
};

function WaveShaper({
  waveShaper,
  onEnabledChange,
  onPresetChange,
  onValueChange,
}: WaveShaperProps) {
  const { t } = useTranslation('synth');

  const presetLabels: Record<WaveShaperPreset, string> = {
    distortion: t('effect.waveShaper.presets.distortion'),
    fuzz: t('effect.waveShaper.presets.fuzz'),
    overdrive: t('effect.waveShaper.presets.overdrive'),
    saturation: t('effect.waveShaper.presets.saturation'),
  };

  const param = waveShaper ? presetParams[waveShaper.preset] : null;

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <AudioWaveform size={18} />
          {t('effect.waveShaper.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          icon={waveShaper ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(
            waveShaper
              ? 'effect.waveShaper.disabled'
              : 'effect.waveShaper.enabled',
          )}
          onClick={() => onEnabledChange(!waveShaper)}
          title={t('effect.waveShaper.enabled')}
        />

        {waveShaper && param && (
          <div className="space-y-3">
            <ControlSelect
              label={t('effect.waveShaper.preset')}
              onChange={(e) =>
                onPresetChange(e.target.value as WaveShaperPreset)
              }
              value={waveShaper.preset}
            >
              {WAVE_SHAPER_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {presetLabels[preset]}
                </option>
              ))}
            </ControlSelect>

            <ControlRange
              displayValue={waveShaper[param.key].toFixed(
                param.step < 1 ? 2 : 0,
              )}
              label={t(`effect.waveShaper.parameters.${param.key}`)}
              max={param.max}
              min={param.min}
              onChange={(value) => onValueChange(param.key, value)}
              step={param.step}
              symbol={<InlineMath math={param.symbol} />}
              value={waveShaper[param.key]}
            />

            <WaveShaperCurvePreview
              formula={param.formula}
              title={t('effect.waveShaper.curve')}
              waveShaper={waveShaper}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default WaveShaper;
