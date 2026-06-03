import { type ReactNode, useMemo, useState } from 'react';
import { AbcContentContext } from './AbcContentContext';

interface AbcContentProviderProps {
  children: ReactNode;
}

export function AbcContentProvider({ children }: AbcContentProviderProps) {
  const [abcContent, setAbcContent] = useState('');

  const value = useMemo(
    () => ({
      abcContent,
      setAbcContent,
    }),
    [abcContent],
  );

  return (
    <AbcContentContext.Provider value={value}>
      {children}
    </AbcContentContext.Provider>
  );
}
