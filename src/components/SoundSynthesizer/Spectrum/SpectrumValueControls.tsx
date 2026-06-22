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
      values={amplitudes}
      labels={HarmonicLabel(amplitudes.length)}
      min="0"
      max="1"
      step="0.01"
      onChange={onChange}
    />
  );
}

export default SpectrumValueControls;
