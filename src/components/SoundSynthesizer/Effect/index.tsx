import Compressor from './Compressor';
import FilterAndEqualizer from './FilterAndEqualizer';
import Modulation from './Modulation';
import Panner from './Panner';
import Reverb from './Reverb';
import WaveShaper from './WaveShaper';

function Effect() {
  return (
    <>
      <FilterAndEqualizer />
      <Reverb />
      <Modulation />
      <WaveShaper />
      <Compressor />
      <Panner />
    </>
  );
}

export default Effect;
