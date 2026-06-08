import { useTranslation } from 'react-i18next';
import { Ban } from 'lucide-react';
import type { CompressorConfig } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import CompressorReductionPreview from './CompressorReductionPreview';

interface CompressorProps {
  compressor: CompressorConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onThresholdChange: (value: number) => void;
  onKneeChange: (value: number) => void;
  onRatioChange: (value: number) => void;
  onAttackChange: (value: number) => void;
  onReleaseChange: (value: number) => void;
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
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <Ban size={18} />
          {t('effect.compressor.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          title={t('effect.compressor.enabled')}
          label={t(
            compressor
              ? 'effect.compressor.disabled'
              : 'effect.compressor.enabled',
          )}
          onClick={() => onEnabledChange(!compressor)}
        />

        {compressor && (
          <div className="space-y-2">
            <ControlRange
              label={t('effect.compressor.threshold')}
              min="-100"
              max="0"
              step="1"
              value={compressor.threshold}
              displayValue={`${compressor.threshold.toFixed(0)} dB`}
              onChange={onThresholdChange}
            />
            <ControlRange
              label={t('effect.compressor.knee')}
              min="0"
              max="40"
              step="1"
              value={compressor.knee}
              displayValue={`${compressor.knee.toFixed(0)} dB`}
              onChange={onKneeChange}
            />
            <ControlRange
              label={t('effect.compressor.ratio')}
              min="1"
              max="20"
              step="0.1"
              value={compressor.ratio}
              displayValue={`${compressor.ratio.toFixed(1)}:1`}
              onChange={onRatioChange}
            />
            <ControlRange
              label={t('effect.compressor.attack')}
              min="0"
              max="1"
              step="0.001"
              value={compressor.attack}
              displayValue={`${(compressor.attack * 1000).toFixed(0)} ms`}
              onChange={onAttackChange}
            />
            <ControlRange
              label={t('effect.compressor.release')}
              min="0"
              max="1"
              step="0.001"
              value={compressor.release}
              displayValue={`${(compressor.release * 1000).toFixed(0)} ms`}
              onChange={onReleaseChange}
            />
            <CompressorReductionPreview
              title={t('effect.compressor.reduction')}
              enabled={Boolean(compressor)}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default Compressor;
