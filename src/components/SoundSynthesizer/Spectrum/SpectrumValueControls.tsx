import VerticalSliderGroup from '../../shared/VerticalSliderGroup';
import { getHarmonicLabels } from '../../../utils/harmonic';

interface SpectrumValueControlsProps {
  amplitudes: number[];
  onChange: (index: number, value: number) => void;
}

function SpectrumValueControls({
  amplitudes,
  onChange,
}: SpectrumValueControlsProps) {
  const harmonicLabels = getHarmonicLabels(amplitudes.length);

  return (
    <VerticalSliderGroup
      values={amplitudes}
      labels={harmonicLabels}
      min="0"
      max="1"
      step="0.01"
      onChange={onChange}
    />
  );
}

export default SpectrumValueControls;
