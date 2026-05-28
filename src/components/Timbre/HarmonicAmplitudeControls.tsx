import VerticalSliderGroup from '../shared/VerticalSliderGroup';
import { getHarmonicLabels } from '../../utils/harmonic';

interface HarmonicAmplitudeControlsProps {
  amplitudes: number[];
  onChange: (index: number, value: number) => void;
}

function HarmonicAmplitudeControls({
  amplitudes,
  onChange,
}: HarmonicAmplitudeControlsProps) {
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

export default HarmonicAmplitudeControls;
