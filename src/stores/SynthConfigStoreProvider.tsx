import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  createSynthConfigStore,
  SynthConfigStoreContext,
} from './synthConfigStore';

interface SynthConfigStoreProviderProps {
  children: ReactNode;
}

export function SynthConfigStoreProvider({
  children,
}: SynthConfigStoreProviderProps) {
  const [store] = useState(createSynthConfigStore);

  return (
    <SynthConfigStoreContext.Provider value={store}>
      {children}
    </SynthConfigStoreContext.Provider>
  );
}
