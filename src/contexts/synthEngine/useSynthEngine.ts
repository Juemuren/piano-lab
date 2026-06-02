import { useContext } from 'react';
import { SynthEngineContext } from './SynthEngineContextValue';

export function useSynthEngine() {
  const synthEngine = useContext(SynthEngineContext);

  if (!synthEngine) {
    throw new Error('useSynthEngine must be used within SynthEngineProvider');
  }

  return synthEngine;
}
