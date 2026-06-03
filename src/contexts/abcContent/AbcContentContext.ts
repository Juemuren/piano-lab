import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export interface AbcContentContextValue {
  abcContent: string;
  setAbcContent: Dispatch<SetStateAction<string>>;
}

export const AbcContentContext = createContext<AbcContentContextValue | null>(
  null,
);
