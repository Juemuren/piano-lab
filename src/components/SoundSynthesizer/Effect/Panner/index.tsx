import { useTranslation } from 'react-i18next';
import { MoveHorizontal } from 'lucide-react';
import type { PannerConfig } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';

interface PannerProps {
  panner: PannerConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onPanChange: (value: number) => void;
}

function Panner({ panner, onEnabledChange, onPanChange }: PannerProps) {
  const { t } = useTranslation('synth');

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        {t('effect.panner.name')}
      </summary>

      <div className="space-y-3">
        <ControlButton
          title={t('effect.panner.enabled')}
          icon={<MoveHorizontal size={18} />}
          label={t(panner ? 'effect.panner.disabled' : 'effect.panner.enabled')}
          onClick={() => onEnabledChange(!panner)}
        />

        {panner && (
          <ControlRange
            label={t('effect.panner.pan')}
            min="-1"
            max="1"
            step="0.01"
            value={panner.pan}
            displayValue={panner.pan.toFixed(2)}
            p={t('effect.panner.range')}
            onChange={onPanChange}
          />
        )}
      </div>
    </details>
  );
}

export default Panner;
