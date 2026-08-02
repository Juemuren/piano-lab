import { Equal, Power, PowerOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useFilterEqualizerControl from '../../../../hooks/synth/effect/useFilterEqualizerControl';
import type { FilterEqualizerPreset } from '../../../../services/synth/config/Options';
import { FILTER_EQUALIZER_PRESETS } from '../../../../services/synth/config/Options';
import { useSynthConfigStore } from '../../../../stores/synthConfigStore';
import ControlButton from '../../../shared/ControlButton';
import ControlSelect from '../../../shared/ControlSelect';
import Equalizer from './Equalizer';
import Filter from './Filter';
import HarmonicResponsePreview from './HarmonicResponsePreview';
import MagnitudeResponsePreview from './MagnitudeResponsePreview';

function FilterAndEqualizer() {
  const { t } = useTranslation('synth');
  const harmonicCount = useSynthConfigStore(
    (state) => state.config.synth.harmonicCount,
  );
  const {
    addEqualizer: onEqualizerAdd,
    addFilter: onFilterAdd,
    filterEqualizer,
    removeEqualizer: onEqualizerRemove,
    removeFilter: onFilterRemove,
    updateEqualizer: onEqualizerChange,
    updateFilter: onFilterChange,
    updateFilterEqualizerEnabled: onEnabledChange,
    updateFilterEqualizerPreset: onPresetChange,
  } = useFilterEqualizerControl();
  const presetLabels: Record<FilterEqualizerPreset, string> = {
    classical: t('effect.filterEqualizer.presets.classical'),
    custom: t('effect.filterEqualizer.presets.custom'),
    jazz: t('effect.filterEqualizer.presets.jazz'),
    pop: t('effect.filterEqualizer.presets.pop'),
    rock: t('effect.filterEqualizer.presets.rock'),
  };

  return (
    <details className="my-2" open>
      <summary className="my-2 font-bold text-lg">
        <span className="inline-flex items-center gap-1">
          <Equal size={18} />
          {t('effect.filterEqualizer.name')}
        </span>
      </summary>
      <div className="space-y-3">
        <ControlButton
          icon={filterEqualizer ? <Power size={18} /> : <PowerOff size={18} />}
          label={t(
            filterEqualizer
              ? 'effect.filterEqualizer.disabled'
              : 'effect.filterEqualizer.enabled',
          )}
          onClick={() => onEnabledChange(!filterEqualizer)}
          title={t('effect.filterEqualizer.enabled')}
        />

        {filterEqualizer && (
          <div className="space-y-3">
            <ControlSelect
              label={t('effect.filterEqualizer.preset')}
              onChange={(event) =>
                onPresetChange(event.target.value as FilterEqualizerPreset)
              }
              value={filterEqualizer.preset}
            >
              {FILTER_EQUALIZER_PRESETS.map((preset) => (
                <option key={preset} value={preset}>
                  {presetLabels[preset]}
                </option>
              ))}
            </ControlSelect>

            <Filter
              filters={filterEqualizer.filters}
              onAdd={onFilterAdd}
              onChange={onFilterChange}
              onRemove={onFilterRemove}
            />
            <Equalizer
              equalizers={filterEqualizer.equalizers}
              onAdd={onEqualizerAdd}
              onChange={onEqualizerChange}
              onRemove={onEqualizerRemove}
            />
            <MagnitudeResponsePreview
              equalizers={filterEqualizer.equalizers}
              filters={filterEqualizer.filters}
              title={t('effect.filterEqualizer.magnitudeResponseCurve')}
            />
            <HarmonicResponsePreview
              equalizers={filterEqualizer.equalizers}
              filters={filterEqualizer.filters}
              harmonicCount={harmonicCount}
              title={t('effect.filterEqualizer.magnitudeResponseSample')}
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default FilterAndEqualizer;
