import { Ban, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import type { CompressorConfig } from '../../../../services/synth/effect/Compressor';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import CompressorReductionPreview from './CompressorReductionPreview';

interface CompressorProps {
  compressor: CompressorConfig | null;
  onAttackChange: (value: number) => void;
  onEnabledChange: (enabled: boolean) => void;
  onKneeChange: (value: number) => void;
  onRatioChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
  onThresholdChange: (value: number) => void;
}

function Compressor({
  compressor,
  onEnabledChange,
  onThresholdChange,
  onKneeChange,
  onRatioChange,
  onAttackChange,
  onReleaseChange,
}: CompressorProps) {
  const { t } = useTranslation('synth');

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <Ban size={18} />
          {t('effect.compressor.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          icon={compressor ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(
            compressor
              ? 'effect.compressor.disabled'
              : 'effect.compressor.enabled',
          )}
          onClick={() => onEnabledChange(!compressor)}
          title={t('effect.compressor.enabled')}
        />

        {compressor && (
          <div className="space-y-2">
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.threshold}
              displayValue={`${compressor.threshold.toFixed(0)} dB`}
              label={t('effect.compressor.threshold')}
              onChange={onThresholdChange}
              step="1"
              value={compressor.threshold}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.knee}
              displayValue={`${compressor.knee.toFixed(0)} dB`}
              label={t('effect.compressor.knee')}
              onChange={onKneeChange}
              step="1"
              value={compressor.knee}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.ratio}
              displayValue={`${compressor.ratio.toFixed(1)}:1`}
              label={t('effect.compressor.ratio')}
              onChange={onRatioChange}
              step="0.1"
              value={compressor.ratio}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.attack}
              displayValue={`${(compressor.attack * 1000).toFixed(0)} ms`}
              label={t('effect.compressor.attack')}
              onChange={onAttackChange}
              step="0.001"
              value={compressor.attack}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.release}
              displayValue={`${(compressor.release * 1000).toFixed(0)} ms`}
              label={t('effect.compressor.release')}
              onChange={onReleaseChange}
              step="0.001"
              value={compressor.release}
            />
            <CompressorReductionPreview
              enabled={Boolean(compressor)}
              title={t('effect.compressor.reduction')}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default Compressor;
