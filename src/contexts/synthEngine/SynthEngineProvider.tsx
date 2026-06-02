import { type ReactNode, useState } from 'react';
import { SynthEngine } from '../../services/synth/SynthEngine';
import { SynthEngineContext } from './SynthEngineContext';

interface SynthEngineProviderProps {
  children: ReactNode;
}

export function SynthEngineProvider({ children }: SynthEngineProviderProps) {
  const [synthEngine] = useState(() => new SynthEngine());

  return (
    <SynthEngineContext.Provider value={synthEngine}>
      {children}
    </SynthEngineContext.Provider>
  );
}
