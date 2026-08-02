import { Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useCompressorControl from '../../../../hooks/synth/effect/useCompressorControl';
import { SYNTH_CONFIG_RANGES } from '../../../../services/synth/config/Ranges';
import ControlRange from '../../../shared/ControlRange';
import EffectToggleButton from '../EffectToggleButton';
import CompressorReductionPreview from './CompressorReductionPreview';

function Compressor() {
  const { t } = useTranslation('synth');
  const {
    compressor,
    updateCompressorEnabled: onEnabledChange,
    updateCompressor,
  } = useCompressorControl();

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <Ban size={18} />
          {t('effect.compressor.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <EffectToggleButton
          disableLabel={t('effect.compressor.disabled')}
          enabled={Boolean(compressor)}
          enableLabel={t('effect.compressor.enabled')}
          onClick={() => onEnabledChange(!compressor)}
          title={t('effect.compressor.enabled')}
        />

        {compressor && (
          <div className="space-y-2">
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.threshold}
              displayValue={`${compressor.threshold.toFixed(0)} dB`}
              label={t('effect.compressor.threshold')}
              onChange={(value) => updateCompressor('threshold', value)}
              step="1"
              value={compressor.threshold}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.knee}
              displayValue={`${compressor.knee.toFixed(0)} dB`}
              label={t('effect.compressor.knee')}
              onChange={(value) => updateCompressor('knee', value)}
              step="1"
              value={compressor.knee}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.ratio}
              displayValue={`${compressor.ratio.toFixed(1)}:1`}
              label={t('effect.compressor.ratio')}
              onChange={(value) => updateCompressor('ratio', value)}
              step="0.1"
              value={compressor.ratio}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.attack}
              displayValue={`${(compressor.attack * 1000).toFixed(0)} ms`}
              label={t('effect.compressor.attack')}
              onChange={(value) => updateCompressor('attack', value)}
              step="0.001"
              value={compressor.attack}
            />
            <ControlRange
              {...SYNTH_CONFIG_RANGES.effect.compressor.release}
              displayValue={`${(compressor.release * 1000).toFixed(0)} ms`}
              label={t('effect.compressor.release')}
              onChange={(value) => updateCompressor('release', value)}
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
