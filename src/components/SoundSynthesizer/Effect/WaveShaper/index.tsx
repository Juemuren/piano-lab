import { AudioWaveform, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InlineMath } from 'react-katex';
import type { WaveShaperConfig, WaveShaperPreset } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import WaveShaperCurvePreview from './WaveShaperCurvePreview';

interface WaveShaperProps {
  waveShaper: WaveShaperConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onPresetChange: (preset: WaveShaperPreset) => void;
  onValueChange: (
    key: Exclude<keyof WaveShaperConfig, 'preset'>,
    value: number,
  ) => void;
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
  saturation: {
    key: 'saturation',
    symbol: 'c',
    min: 0,
    max: 1,
    step: 0.01,
    formula: String.raw`y=\frac{x}{1+c|x|}`,
  },
  distortion: {
    key: 'distortion',
    symbol: 'g',
    min: 2,
    max: 10,
    step: 0.1,
    formula: String.raw`y=\tanh(gx)`,
  },
  overdrive: {
    key: 'overdrive',
    symbol: 'k',
    min: 1,
    max: 20,
    step: 0.1,
    formula: String.raw`y=\frac{\arctan(kx)}{\arctan(k)}`,
  },
  fuzz: {
    key: 'fuzz',
    symbol: 's',
    min: 10,
    max: 100,
    step: 1,
    formula: String.raw`y=\frac{2}{\pi}\arctan(sx)`,
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
    saturation: t('effect.waveShaper.presets.saturation'),
    distortion: t('effect.waveShaper.presets.distortion'),
    overdrive: t('effect.waveShaper.presets.overdrive'),
    fuzz: t('effect.waveShaper.presets.fuzz'),
  };

  const param = waveShaper ? presetParams[waveShaper.preset] : null;

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <AudioWaveform size={18} />
          {t('effect.waveShaper.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          title={t('effect.waveShaper.enabled')}
          icon={waveShaper ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(
            waveShaper
              ? 'effect.waveShaper.disabled'
              : 'effect.waveShaper.enabled',
          )}
          onClick={() => onEnabledChange(!waveShaper)}
        />

        {waveShaper && param && (
          <div className="space-y-3">
            <ControlSelect
              label={t('effect.waveShaper.preset')}
              value={waveShaper.preset}
              onChange={(e) =>
                onPresetChange(e.target.value as WaveShaperPreset)
              }
            >
              {presetOptions.map((preset) => (
                <option key={preset} value={preset}>
                  {presetLabels[preset]}
                </option>
              ))}
            </ControlSelect>

            <ControlRange
              label={t(`effect.waveShaper.parameters.${param.key}`)}
              symbol={<InlineMath math={param.symbol} />}
              min={param.min}
              max={param.max}
              step={param.step}
              value={waveShaper[param.key]}
              displayValue={waveShaper[param.key].toFixed(
                param.step < 1 ? 2 : 0,
              )}
              onChange={(value) => onValueChange(param.key, value)}
            />

            <WaveShaperCurvePreview
              title={t('effect.waveShaper.curve')}
              formula={param.formula}
              waveShaper={waveShaper}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default WaveShaper;
