import Compressor from './Compressor';
import FilterEqualizer from './FilterEqualizer';
import Modulation from './Modulation';
import Panner from './Panner';
import Reverb from './Reverb';
import WaveShaper from './WaveShaper';

function Effect() {
  return (
    <>
      <FilterEqualizer />
      <Reverb />
      <Modulation />
      <WaveShaper />
      <Compressor />
      <Panner />
    </>
  );
}

export default Effect;
