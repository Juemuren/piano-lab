import { createContext, useContext } from 'react';
import type { StoreApi } from 'zustand';
import { createStore, useStore } from 'zustand';
import { createDefaultSynthConfig } from '../services/synth/config/Factories';
import type { SynthConfig } from '../services/synth/config/Schema';

type ConfigUpdate<Config> = Config | ((current: Config) => Config);

interface SynthConfigState {
  config: SynthConfig;
  setConfig: (config: SynthConfig) => void;
  setEffectSection: <Key extends keyof SynthConfig['effect']>(
    key: Key,
    update: ConfigUpdate<SynthConfig['effect'][Key]>,
  ) => void;
  setEnvelopeConfig: (update: ConfigUpdate<SynthConfig['envelope']>) => void;
  setSpectrumConfig: (update: ConfigUpdate<SynthConfig['spectrum']>) => void;
  setSynthConfig: (update: ConfigUpdate<SynthConfig['synth']>) => void;
}

export type SynthConfigStore = StoreApi<SynthConfigState>;

function resolveUpdate<Config>(current: Config, update: ConfigUpdate<Config>) {
  return typeof update === 'function'
    ? (update as (current: Config) => Config)(current)
    : update;
}

function resizeAmplitudes(amplitudes: number[], length: number) {
  return Array.from({ length }, (_, index) => amplitudes[index] ?? 0);
}

export function createSynthConfigStore() {
  return createStore<SynthConfigState>()((set) => ({
    config: createDefaultSynthConfig(),
    setConfig: (config) => set({ config }),
    setEffectSection: (key, update) =>
      set(({ config }) => ({
        config: {
          ...config,
          effect: {
            ...config.effect,
            [key]: resolveUpdate(config.effect[key], update),
          },
        },
      })),
    setEnvelopeConfig: (update) =>
      set(({ config }) => ({
        config: {
          ...config,
          envelope: resolveUpdate(config.envelope, update),
        },
      })),
    setSpectrumConfig: (update) =>
      set(({ config }) => ({
        config: {
          ...config,
          spectrum: resolveUpdate(config.spectrum, update),
        },
      })),
    setSynthConfig: (update) =>
      set(({ config }) => {
        const synth = resolveUpdate(config.synth, update);

        return {
          config: {
            ...config,
            spectrum: {
              ...config.spectrum,
              customAmplitudes: resizeAmplitudes(
                config.spectrum.customAmplitudes,
                synth.harmonicCount,
              ),
            },
            synth,
          },
        };
      }),
  }));
}

export const SynthConfigStoreContext = createContext<SynthConfigStore | null>(
  null,
);

export function useSynthConfigStoreApi() {
  const store = useContext(SynthConfigStoreContext);

  if (!store) {
    throw new Error('SynthConfigStoreProvider is missing');
  }

  return store;
}

export function useSynthConfigStore<Selected>(
  selector: (state: SynthConfigState) => Selected,
) {
  return useStore(useSynthConfigStoreApi(), selector);
}
