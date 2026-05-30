import { createContext } from 'react';
import type { SynthEngine } from '../services/synth/SynthEngine';

export const SynthEngineContext = createContext<SynthEngine | null>(null);
