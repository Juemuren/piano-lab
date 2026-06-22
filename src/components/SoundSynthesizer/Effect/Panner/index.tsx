import {
  Compass,
  Crosshair,
  Power,
  PowerOff,
  Radio,
  Ruler,
  Triangle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { PannerConfig } from '../../../../types';
import ControlButton from '../../../shared/ControlButton';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';
import PannerDistanceGainPreview from './PannerDistanceGainPreview';
import PannerSpatialPreview from './PannerSpatialPreview';

interface PannerProps {
  onEnabledChange: (enabled: boolean) => void;
  onValueChange: <Key extends keyof PannerConfig>(
    key: Key,
    value: PannerConfig[Key],
  ) => void;
  panner: PannerConfig | null;
}

interface PannerControlGroupProps {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
}

function PannerControlGroup({
  title,
  icon,
  children,
}: PannerControlGroupProps) {
  return (
    <details className="my-2" open>
      <summary className="px-2 pt-2 font-semibold text-sm">
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
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <Radio size={18} />
          {t('effect.panner.name')}
        </span>
      </summary>

      <div className="space-y-3">
        <ControlButton
          icon={panner ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(panner ? 'effect.panner.disabled' : 'effect.panner.enabled')}
          onClick={() => onEnabledChange(!panner)}
          title={t('effect.panner.enabled')}
        />

        {panner && (
          <div className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <ControlSelect
                label={t('effect.panner.panningModel')}
                onChange={(event) =>
                  onValueChange(
                    'panningModel',
                    event.target.value as PanningModelType,
                  )
                }
                value={panner.panningModel}
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
                onChange={(event) =>
                  onValueChange(
                    'distanceModel',
                    event.target.value as DistanceModelType,
                  )
                }
                value={panner.distanceModel}
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
              icon={<Crosshair size={14} />}
              title={t('effect.panner.position')}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  displayValue={panner.positionX.toFixed(2)}
                  label="X"
                  max="10"
                  min="-10"
                  onChange={(value) => onValueChange('positionX', value)}
                  step="0.01"
                  value={panner.positionX}
                />
                <ControlRange
                  displayValue={panner.positionY.toFixed(2)}
                  label="Y"
                  max="10"
                  min="-10"
                  onChange={(value) => onValueChange('positionY', value)}
                  step="0.01"
                  value={panner.positionY}
                />
                <ControlRange
                  displayValue={panner.positionZ.toFixed(2)}
                  label="Z"
                  max="10"
                  min="-10"
                  onChange={(value) => onValueChange('positionZ', value)}
                  step="0.01"
                  value={panner.positionZ}
                />
              </div>
            </PannerControlGroup>

            <PannerControlGroup
              icon={<Compass size={14} />}
              title={t('effect.panner.orientation')}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  displayValue={panner.orientationX.toFixed(2)}
                  label="X"
                  max="1"
                  min="-1"
                  onChange={(value) => onValueChange('orientationX', value)}
                  step="0.01"
                  value={panner.orientationX}
                />
                <ControlRange
                  displayValue={panner.orientationY.toFixed(2)}
                  label="Y"
                  max="1"
                  min="-1"
                  onChange={(value) => onValueChange('orientationY', value)}
                  step="0.01"
                  value={panner.orientationY}
                />
                <ControlRange
                  displayValue={panner.orientationZ.toFixed(2)}
                  label="Z"
                  max="1"
                  min="-1"
                  onChange={(value) => onValueChange('orientationZ', value)}
                  step="0.01"
                  value={panner.orientationZ}
                />
              </div>
            </PannerControlGroup>

            <PannerControlGroup
              icon={<Ruler size={14} />}
              title={t('effect.panner.distance')}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  displayValue={panner.refDistance.toFixed(2)}
                  label={t('effect.panner.refDistance')}
                  max="10"
                  min="0.01"
                  onChange={(value) => onValueChange('refDistance', value)}
                  step="0.01"
                  value={panner.refDistance}
                />
                <ControlRange
                  displayValue={panner.maxDistance.toFixed(0)}
                  label={t('effect.panner.maxDistance')}
                  max="10000"
                  min="1"
                  onChange={(value) => onValueChange('maxDistance', value)}
                  step="1"
                  value={panner.maxDistance}
                />
                <ControlRange
                  displayValue={panner.rolloffFactor.toFixed(2)}
                  label={t('effect.panner.rolloffFactor')}
                  max="10"
                  min="0"
                  onChange={(value) => onValueChange('rolloffFactor', value)}
                  step="0.01"
                  value={panner.rolloffFactor}
                />
              </div>
            </PannerControlGroup>

            <PannerControlGroup
              icon={<Triangle size={14} />}
              title={t('effect.panner.angle')}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <ControlRange
                  displayValue={`${panner.coneInnerAngle.toFixed(0)}°`}
                  label={t('effect.panner.coneInnerAngle')}
                  max="360"
                  min="0"
                  onChange={(value) => onValueChange('coneInnerAngle', value)}
                  step="1"
                  value={panner.coneInnerAngle}
                />
                <ControlRange
                  displayValue={`${panner.coneOuterAngle.toFixed(0)}°`}
                  label={t('effect.panner.coneOuterAngle')}
                  max="360"
                  min="0"
                  onChange={(value) => onValueChange('coneOuterAngle', value)}
                  step="1"
                  value={panner.coneOuterAngle}
                />
                <ControlRange
                  displayValue={panner.coneOuterGain.toFixed(2)}
                  label={t('effect.panner.coneOuterGain')}
                  max="1"
                  min="0"
                  onChange={(value) => onValueChange('coneOuterGain', value)}
                  step="0.01"
                  value={panner.coneOuterGain}
                />
              </div>
            </PannerControlGroup>

            <PannerSpatialPreview
              panner={panner}
              title={t('effect.panner.spatialPreview')}
            />
            <PannerDistanceGainPreview
              panner={panner}
              title={t('effect.panner.distanceGainPreview')}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default Panner;
