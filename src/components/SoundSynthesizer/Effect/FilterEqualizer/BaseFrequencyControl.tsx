import { InlineMath } from 'react-katex';
import ControlRange from '../../../shared/ControlRange';
import ControlSelect from '../../../shared/ControlSelect';

interface BaseFrequencyOption {
  label: string;
  pitch: number | 'custom';
}

interface BaseFrequencyControlProps {
  getBaseFrequency: (pitch: number) => number;
  labelRange: string;
  labelSelect: string;
  onChange: (value: number) => void;
  pitchOptions: BaseFrequencyOption[];
  selectedPitch?: number;
  value: number;
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
      <div className="grid sm:grid-cols-[2fr_1fr] sm:gap-3">
        <ControlRange
          accentClassName="text-app-info dark:text-app-info-dark"
          displayValue={`${value.toFixed(2)} Hz`}
          label={labelRange}
          max="5000"
          min="20"
          onChange={onChange}
          pClassName="text-app-info/50 dark:text-app-info-dark/50"
          step="1"
          symbol={<InlineMath math="f_1" />}
          value={value}
        />
        <ControlSelect
          label={labelSelect}
          onChange={(e) => {
            if (e.target.value === 'custom') return;
            onChange(getBaseFrequency(Number(e.target.value)));
          }}
          value={selectedPitch ?? 'custom'}
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
