import { InlineMath } from 'react-katex';
import ControlRange from '../../shared/ControlRange';
import ControlSelect from '../../shared/ControlSelect';

interface BaseFrequencyOption {
  pitch: number | 'custom';
  label: string;
}

interface BaseFrequencyControlProps {
  label: string;
  hint: string;
  value: number;
  selectedPitch?: number;
  pitchOptions: BaseFrequencyOption[];
  getBaseFrequency: (pitch: number) => number;
  onChange: (value: number) => void;
}

function BaseFrequencyControl({
  label,
  hint,
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
          label={label}
          symbol={<InlineMath math="f" />}
          min="20"
          max="5000"
          step="1"
          value={value}
          displayValue={`${value.toFixed(2)} Hz`}
          accentClassName="accent-app-info dark:accent-app-info-dark"
          onChange={onChange}
        />
        <ControlSelect
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
      <p className="mt-2 text-xs text-app-info/50 dark:text-app-info-dark/50">
        {hint}
      </p>
    </div>
  );
}

export default BaseFrequencyControl;
