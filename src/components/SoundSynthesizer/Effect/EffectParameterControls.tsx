import { InlineMath } from 'react-katex';
import type { EffectConfig, EffectParamUpdates } from '../../../types';
import ControlRange from '../../shared/ControlRange';

interface EffectParameterControlsProps {
  effectConfig: EffectConfig;
  labels: {
    delayTime: string;
    attenuation: string;
    minFrequency: string;
    maxFrequency: string;
  };
  onChange: (updates: EffectParamUpdates) => void;
}

function EffectParameterControls({
  effectConfig,
  labels,
  onChange,
}: EffectParameterControlsProps) {
  return (
    <>
      {(effectConfig.type === 'delay' ||
        effectConfig.type === 'single_echo' ||
        effectConfig.type === 'multi_echo' ||
        effectConfig.type === 'all_pass') && (
        <ControlRange
          label={labels.delayTime}
          symbol={<InlineMath math="\tau" />}
          min="0"
          max="100"
          step="0.1"
          value={effectConfig.tau}
          displayValue={`${effectConfig.tau.toFixed(1)} ms`}
          onChange={(value) => onChange({ tau: value })}
        />
      )}

      {(effectConfig.type === 'single_echo' ||
        effectConfig.type === 'multi_echo' ||
        effectConfig.type === 'all_pass') && (
        <ControlRange
          label={labels.attenuation}
          symbol={<InlineMath math="\alpha" />}
          min="0"
          max="0.5"
          step="0.01"
          value={effectConfig.alpha}
          displayValue={effectConfig.alpha.toFixed(2)}
          onChange={(value) => onChange({ alpha: value })}
        />
      )}

      {(effectConfig.type === 'high_pass' ||
        effectConfig.type === 'band_pass') && (
        <ControlRange
          label={labels.minFrequency}
          symbol={<InlineMath math="f_{\min}" />}
          min="20"
          max="20000"
          step="10"
          value={effectConfig.minFrequency}
          displayValue={`${effectConfig.minFrequency} Hz`}
          onChange={(value) => onChange({ minFrequency: value })}
        />
      )}

      {(effectConfig.type === 'low_pass' ||
        effectConfig.type === 'band_pass') && (
        <ControlRange
          label={labels.maxFrequency}
          symbol={<InlineMath math="f_{\max}" />}
          min="20"
          max="20000"
          step="10"
          value={effectConfig.maxFrequency}
          displayValue={`${effectConfig.maxFrequency} Hz`}
          onChange={(value) => onChange({ maxFrequency: value })}
        />
      )}
    </>
  );
}

export default EffectParameterControls;
