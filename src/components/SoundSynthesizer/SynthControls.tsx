import {
  Activity,
  Layers2,
  Layers3,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SynthOscillatorType } from '../../services/synth/config/Options';
import { SYNTH_CONFIG_RANGES } from '../../services/synth/config/Ranges';
import type { SynthConfig } from '../../services/synth/config/Schema';
import { useSynthConfigStore } from '../../stores/synthConfigStore';
import ControlRange from '../shared/ControlRange';
import ControlSelect from '../shared/ControlSelect';

type UpdateSynthConfig = <Key extends keyof SynthConfig['synth']>(
  key: Key,
  value: SynthConfig['synth'][Key],
) => void;

interface SynthControlsProps {
  updateSynthConfig: UpdateSynthConfig;
}

function SynthControls({ updateSynthConfig }: SynthControlsProps) {
  const { t } = useTranslation('synth');
  const { harmonicCount, oscillatorType, volumeRatio } = useSynthConfigStore(
    (state) => state.config.synth,
  );
  const volumeIcon = useMemo(() => {
    if (volumeRatio === 0) return <VolumeX size={16} />;
    if (volumeRatio >= 0.5) return <Volume2 size={16} />;

    return <Volume1 size={16} />;
  }, [volumeRatio]);
  const harmonicIcon = useMemo(() => {
    if (harmonicCount >= 10) return <Layers3 size={16} />;

    return <Layers2 size={16} />;
  }, [harmonicCount]);

  return (
    <>
      <ControlSelect
        icon={<Activity size={16} />}
        label={t('controls.oscillatorType')}
        onChange={(event) =>
          updateSynthConfig(
            'oscillatorType',
            event.target.value as SynthOscillatorType,
          )
        }
        value={oscillatorType}
      >
        <option value="sine">{t('oscillator.sine')}</option>
        <option value="triangle">{t('oscillator.triangle')}</option>
        <option value="sawtooth">{t('oscillator.sawtooth')}</option>
        <option value="square">{t('oscillator.square')}</option>
      </ControlSelect>
      <ControlRange
        {...SYNTH_CONFIG_RANGES.synth.volumeRatio}
        displayValue={`${Math.trunc(volumeRatio * 100).toString()}%`}
        icon={volumeIcon}
        label={t('controls.volume')}
        onChange={(value) => updateSynthConfig('volumeRatio', value)}
        step="0.01"
        value={volumeRatio}
      />
      <ControlRange
        {...SYNTH_CONFIG_RANGES.synth.harmonicCount}
        accentClassName="text-app-warning dark:text-app-warning-dark"
        displayValue={harmonicCount.toString()}
        icon={harmonicIcon}
        label={t('controls.harmonicCount')}
        onChange={(value) =>
          updateSynthConfig('harmonicCount', Math.round(value))
        }
        p={t('controls.harmonicCountWarning')}
        pClassName="text-app-warning/50 dark:text-app-warning-dark/50"
        step="1"
        value={harmonicCount}
      />
    </>
  );
}

export default SynthControls;
