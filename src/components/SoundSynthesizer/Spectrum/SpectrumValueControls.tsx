import { SYNTH_CONFIG_RANGES } from '../../../services/synth/config/Ranges';
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
      {...SYNTH_CONFIG_RANGES.spectrum.amplitude}
      labels={HarmonicLabel(amplitudes.length)}
      onChange={onChange}
      step="0.01"
      values={amplitudes}
    />
  );
}

export default SpectrumValueControls;
