import { useEffect, useState } from 'react';
import { useSynthEngine } from '../../contexts/synthEngine';

export interface CompressorReductionSample {
  reduction: number;
  time: number;
}

const SAMPLE_INTERVAL_MS = 100;
const HISTORY_DURATION_SECONDS = 10;

function useCompressorReductionHistory(enabled: boolean) {
  const synthEngine = useSynthEngine();
  const [samples, setSamples] = useState<CompressorReductionSample[]>([]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const startedAt = performance.now();
    const intervalId = window.setInterval(() => {
      const time = (performance.now() - startedAt) / 1000;
      const reduction = synthEngine.getCompressorReduction();

      setSamples((current) => [
        ...current.filter(
          (sample) => time - sample.time <= HISTORY_DURATION_SECONDS,
        ),
        { reduction, time },
      ]);
    }, SAMPLE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, synthEngine]);

  return samples;
}

export default useCompressorReductionHistory;
