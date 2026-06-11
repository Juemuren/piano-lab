import { InlineMath } from 'react-katex';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface BaseFrequencyOption {
  pitch: number | 'custom';
  label: string;
}

interface BaseFrequencyControlProps {
  labelRange: string;
  labelSelect: string;
  value: number;
  selectedPitch?: number;
  pitchOptions: BaseFrequencyOption[];
  getBaseFrequency: (pitch: number) => number;
  onChange: (value: number) => void;
}

function BaseFrequencyControl({
  labelRange,
  labelSelect,
  value,
  selectedPitch,
  pitchOptions,
  getBaseFrequency,
  onChange,
}: BaseFrequencyControlProps) {
  return (
    <div className="my-4">
      <div className="grid sm:gap-3 sm:grid-cols-[2fr_1fr]">
        <ControlRange
          label={labelRange}
          symbol={<InlineMath math="f_1" />}
          min="20"
          max="5000"
          step="1"
          value={value}
          displayValue={`${value.toFixed(2)} Hz`}
          accentClassName="text-app-info dark:text-app-info-dark"
          pClassName="text-app-info/50 dark:text-app-info-dark/50"
          onChange={onChange}
        />
        <ControlSelect
          label={labelSelect}
          value={selectedPitch ?? 'custom'}
          onChange={(e) => {
            if (e.target.value === 'custom') return;
            onChange(getBaseFrequency(Number(e.target.value)));
          }}
        >
          {pitchOptions.map(({ pitch, label }) => (
            <option key={pitch} value={pitch}>
              {label}
            </option>
          ))}
        </ControlSelect>
      </div>
    </div>
  );
}

export default BaseFrequencyControl;
