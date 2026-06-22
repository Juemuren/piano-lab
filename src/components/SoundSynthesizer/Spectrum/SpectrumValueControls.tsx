import VerticalSliderGroup from '../../shared/VerticalSliderGroup';
import HarmonicLabel from '../shared/HarmonicLabel';

interface SpectrumValueControlsProps {
  amplitudes: number[];
  onChange: (index: number, value: number) => void;
}

function SpectrumValueControls({
  amplitudes,
  onChange,
}: SpectrumValueControlsProps) {
  return (
    <VerticalSliderGroup
      labels={HarmonicLabel(amplitudes.length)}
      max="1"
      min="0"
      onChange={onChange}
      step="0.01"
      values={amplitudes}
    />
  );
}

export default SpectrumValueControls;
