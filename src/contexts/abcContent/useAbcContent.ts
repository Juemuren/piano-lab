import { useContext } from 'react';
import { AbcContentContext } from './AbcContentContext';

export function useAbcContent() {
  const abcContent = useContext(AbcContentContext);

  if (!abcContent) {
    throw new Error('useAbcContent must be used within AbcContentProvider');
  }

  return abcContent;
}
