import { AudioWaveform, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { WaveShaperConfig, WaveShaperPreset } from '../../../../types';
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

type WaveShaperParam = Exclude<keyof WaveShaperConfig, 'preset'>;

const presetOptions: WaveShaperPreset[] = [
  'saturation',
  'overdrive',
  'distortion',
  'fuzz',
];

const presetParams: Record<
  WaveShaperPreset,
  {
    key: WaveShaperParam;
    symbol: string;
    min: number;
    max: number;
    step: number;
    formula: string;
  }
> = {
  distortion: {
    formula: String.raw`y=\tanh(gx)`,
    key: 'distortion',
    max: 10,
    min: 2,
    step: 0.1,
    symbol: 'g',
  },
  fuzz: {
    formula: String.raw`y=\frac{2}{\pi}\arctan(sx)`,
    key: 'fuzz',
    max: 100,
    min: 10,
    step: 1,
    symbol: 's',
  },
  overdrive: {
    formula: String.raw`y=\frac{\arctan(kx)}{\arctan(k)}`,
    key: 'overdrive',
    max: 20,
    min: 1,
    step: 0.1,
    symbol: 'k',
  },
  saturation: {
    formula: String.raw`y=\frac{x}{1+c|x|}`,
    key: 'saturation',
    max: 1,
    min: 0,
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
      <summary className="text-lg font-bold my-2">
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
              {presetOptions.map((preset) => (
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
