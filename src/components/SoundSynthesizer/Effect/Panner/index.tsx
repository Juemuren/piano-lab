import { useTranslation } from 'react-i18next';
import { Radio, Crosshair, Compass, Ruler, Triangle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { PannerConfig } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import PannerDistanceGainPreview from './PannerDistanceGainPreview';
import PannerSpatialPreview from './PannerSpatialPreview';

interface PannerProps {
  panner: PannerConfig | null;
  onEnabledChange: (enabled: boolean) => void;
  onValueChange: <Key extends keyof PannerConfig>(
    key: Key,
    value: PannerConfig[Key],
  ) => void;
}

interface PannerControlGroupProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

function PannerControlGroup({
  title,
  icon,
  children,
}: PannerControlGroupProps) {
  return (
    <details open className="my-2">
      <summary className="px-2 pt-2 text-sm font-semibold">
        <span className="inline-flex items-center gap-1">
          {icon}
          {title}
        </span>
      </summary>
      {children}
    </details>
  );
}

function Panner({ panner, onEnabledChange, onValueChange }: PannerProps) {
  const { t } = useTranslation('synth');

  return (
    <details open className="my-2">
      <summary className="text-lg font-bold my-2">
        <span className="inline-flex items-center gap-1">
          <Radio size={18} />
          {t('effect.panner.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          title={t('effect.panner.enabled')}
          label={t(panner ? 'effect.panner.disabled' : 'effect.panner.enabled')}
          onClick={() => onEnabledChange(!panner)}
        />

        {panner && (
          <div className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <ControlSelect
                label={t('effect.panner.panningModel')}
                value={panner.panningModel}
                onChange={(event) =>
                  onValueChange(
                    'panningModel',
                    event.target.value as PanningModelType,
                  )
                }
              >
                <option value="equalpower">
                  {t('effect.panner.panningModels.equalpower')}
                </option>
                <option value="HRTF">
                  {t('effect.panner.panningModels.HRTF')}
                </option>
              </ControlSelect>
              <ControlSelect
                label={t('effect.panner.distanceModel')}
                value={panner.distanceModel}
                onChange={(event) =>
                  onValueChange(
                    'distanceModel',
                    event.target.value as DistanceModelType,
                  )
                }
              >
                <option value="linear">
                  {t('effect.panner.distanceModels.linear')}
                </option>
                <option value="inverse">
                  {t('effect.panner.distanceModels.inverse')}
                </option>
                <option value="exponential">
                  {t('effect.panner.distanceModels.exponential')}
                </option>
              </ControlSelect>
            </div>

            <PannerControlGroup
              title={t('effect.panner.position')}
              icon={<Crosshair size={14} />}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  label="X"
                  min="-10"
                  max="10"
                  step="0.01"
                  value={panner.positionX}
                  displayValue={panner.positionX.toFixed(2)}
                  onChange={(value) => onValueChange('positionX', value)}
                />
                <ControlRange
                  label="Y"
                  min="-10"
                  max="10"
                  step="0.01"
                  value={panner.positionY}
                  displayValue={panner.positionY.toFixed(2)}
                  onChange={(value) => onValueChange('positionY', value)}
                />
                <ControlRange
                  label="Z"
                  min="-10"
                  max="10"
                  step="0.01"
                  value={panner.positionZ}
                  displayValue={panner.positionZ.toFixed(2)}
                  onChange={(value) => onValueChange('positionZ', value)}
                />
              </div>
            </PannerControlGroup>

            <PannerControlGroup
              title={t('effect.panner.orientation')}
              icon={<Compass size={14} />}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  label="X"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={panner.orientationX}
                  displayValue={panner.orientationX.toFixed(2)}
                  onChange={(value) => onValueChange('orientationX', value)}
                />
                <ControlRange
                  label="Y"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={panner.orientationY}
                  displayValue={panner.orientationY.toFixed(2)}
                  onChange={(value) => onValueChange('orientationY', value)}
                />
                <ControlRange
                  label="Z"
                  min="-1"
                  max="1"
                  step="0.01"
                  value={panner.orientationZ}
                  displayValue={panner.orientationZ.toFixed(2)}
                  onChange={(value) => onValueChange('orientationZ', value)}
                />
              </div>
            </PannerControlGroup>

            <PannerControlGroup
              title={t('effect.panner.distance')}
              icon={<Ruler size={14} />}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  label={t('effect.panner.refDistance')}
                  min="0.01"
                  max="10"
                  step="0.01"
                  value={panner.refDistance}
                  displayValue={panner.refDistance.toFixed(2)}
                  onChange={(value) => onValueChange('refDistance', value)}
                />
                <ControlRange
                  label={t('effect.panner.maxDistance')}
                  min="1"
                  max="10000"
                  step="1"
                  value={panner.maxDistance}
                  displayValue={panner.maxDistance.toFixed(0)}
                  onChange={(value) => onValueChange('maxDistance', value)}
                />
                <ControlRange
                  label={t('effect.panner.rolloffFactor')}
                  min="0"
                  max="10"
                  step="0.01"
                  value={panner.rolloffFactor}
                  displayValue={panner.rolloffFactor.toFixed(2)}
                  onChange={(value) => onValueChange('rolloffFactor', value)}
                />
              </div>
            </PannerControlGroup>

            <PannerControlGroup
              title={t('effect.panner.angle')}
              icon={<Triangle size={14} />}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  label={t('effect.panner.coneInnerAngle')}
                  min="0"
                  max="360"
                  step="1"
                  value={panner.coneInnerAngle}
                  displayValue={`${panner.coneInnerAngle.toFixed(0)}°`}
                  onChange={(value) => onValueChange('coneInnerAngle', value)}
                />
                <ControlRange
                  label={t('effect.panner.coneOuterAngle')}
                  min="0"
                  max="360"
                  step="1"
                  value={panner.coneOuterAngle}
                  displayValue={`${panner.coneOuterAngle.toFixed(0)}°`}
                  onChange={(value) => onValueChange('coneOuterAngle', value)}
                />
                <ControlRange
                  label={t('effect.panner.coneOuterGain')}
                  min="0"
                  max="1"
                  step="0.01"
                  value={panner.coneOuterGain}
                  displayValue={panner.coneOuterGain.toFixed(2)}
                  onChange={(value) => onValueChange('coneOuterGain', value)}
                />
              </div>
            </PannerControlGroup>

            <PannerSpatialPreview
              title={t('effect.panner.spatialPreview')}
              panner={panner}
            />
            <PannerDistanceGainPreview
              title={t('effect.panner.distanceGainPreview')}
              panner={panner}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default Panner;
