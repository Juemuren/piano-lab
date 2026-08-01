import { useCallback, useState } from 'react';
import { SYNTH_CONFIG_DEFAULTS } from '../../../services/synth/config/Defaults';
import { createDefaultReverbConfig } from '../../../services/synth/config/Factories';
import type { ReverbPreset } from '../../../services/synth/config/Options';
import type { ReverbConfig } from '../../../services/synth/effect/Reverb';
import { createReverbConfig } from '../../../services/synth/effect/Reverb';
import { removeItemAt, updateItemAt } from '../../../utils/collection';

function getReverbConfig(config: ReverbConfig | null) {
  return config ?? createDefaultReverbConfig();
}

function useReverbControl(initialReverb: ReverbConfig | null) {
  const [reverb, setReverb] = useState<ReverbConfig | null>(
    () => initialReverb,
  );

  const updateReverbEnabled = useCallback((enabled: boolean) => {
    setReverb((current) =>
      enabled ? (current ?? createDefaultReverbConfig()) : null,
    );
  }, []);

  const updateReverbPreset = useCallback((preset: ReverbPreset) => {
    setReverb((current) => {
      if (preset !== 'custom') {
        return createReverbConfig(
          preset,
          current?.mix ?? SYNTH_CONFIG_DEFAULTS.effect.reverb.mix,
        );
      }

      const source = getReverbConfig(current);

      return {
        ...source,
        earlyReflections: [],
        lateTail: {
          ...source.lateTail,
          amplitude: 0,
          delay: 0,
        },
        preset,
      };
    });
  }, []);

  const updateReverbMix = useCallback((mix: number) => {
    setReverb((current) => ({
      ...getReverbConfig(current),
      mix,
    }));
  }, []);

  const addReverbEarlyReflection = useCallback(() => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        earlyReflections: [
          ...source.earlyReflections,
          {
            ...SYNTH_CONFIG_DEFAULTS.effect.reverb.earlyReflection,
          },
        ],
        preset: 'custom',
      };
    });
  }, []);

  const removeReverbEarlyReflection = useCallback((index: number) => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        earlyReflections: removeItemAt(source.earlyReflections, index),
        preset: 'custom',
      };
    });
  }, []);

  const updateReverbEarlyReflectionDelay = useCallback(
    (index: number, delay: number) => {
      setReverb((current) => {
        const source = getReverbConfig(current);

        return {
          ...source,
          earlyReflections: updateItemAt(
            source.earlyReflections,
            index,
            (reflection) => ({ ...reflection, delay }),
          ),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateReverbEarlyReflectionGain = useCallback(
    (index: number, gain: number) => {
      setReverb((current) => {
        const source = getReverbConfig(current);

        return {
          ...source,
          earlyReflections: updateItemAt(
            source.earlyReflections,
            index,
            (reflection) => ({ ...reflection, gain }),
          ),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateReverbEarlyReflectionPhase = useCallback(
    (index: number, phase: number) => {
      setReverb((current) => {
        const source = getReverbConfig(current);

        return {
          ...source,
          earlyReflections: updateItemAt(
            source.earlyReflections,
            index,
            (reflection) => ({ ...reflection, phase }),
          ),
          preset: 'custom',
        };
      });
    },
    [],
  );

  const updateReverbLateTailDuration = useCallback((duration: number) => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        lateTail: { ...source.lateTail, duration },
        preset: 'custom',
      };
    });
  }, []);

  const updateReverbLateTailDelay = useCallback((delay: number) => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        lateTail: { ...source.lateTail, delay },
        preset: 'custom',
      };
    });
  }, []);

  const updateReverbLateTailAmplitude = useCallback((amplitude: number) => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        lateTail: { ...source.lateTail, amplitude },
        preset: 'custom',
      };
    });
  }, []);

  const updateReverbLateTailAlpha = useCallback((alpha: number) => {
    setReverb((current) => {
      const source = getReverbConfig(current);

      return {
        ...source,
        lateTail: { ...source.lateTail, alpha },
        preset: 'custom',
      };
    });
  }, []);

  return {
    addReverbEarlyReflection,
    removeReverbEarlyReflection,
    reverb,
    updateReverbEarlyReflectionDelay,
    updateReverbEarlyReflectionGain,
    updateReverbEarlyReflectionPhase,
    updateReverbEnabled,
    updateReverbLateTailAlpha,
    updateReverbLateTailAmplitude,
    updateReverbLateTailDelay,
    updateReverbLateTailDuration,
    updateReverbMix,
    updateReverbPreset,
  };
}

export default useReverbControl;
