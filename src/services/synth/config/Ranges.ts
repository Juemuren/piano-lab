export interface NumberRange {
  max: number;
  min: number;
}

export const SYNTH_CONFIG_RANGES = {
  effect: {
    amplitudeModulation: {
      depth: { max: 0.5, min: 0 },
      frequency: { max: 20, min: 0.1 },
    },
    compressor: {
      attack: { max: 1, min: 0 },
      knee: { max: 40, min: 0 },
      ratio: { max: 20, min: 1 },
      release: { max: 1, min: 0 },
      threshold: { max: 0, min: -100 },
    },
    delayModulation: {
      depth: { max: 0.02, min: 0 },
      frequency: { max: 10, min: 0.1 },
    },
    equalizer: {
      frequency: { max: 20000, min: 20 },
      gain: { max: 24, min: -24 },
      q: { max: 20, min: 0.1 },
    },
    filter: {
      frequency: { max: 20000, min: 20 },
      q: { max: 20, min: 0.1 },
    },
    frequencyModulation: {
      depth: { max: 100, min: 0 },
      frequency: { max: 20, min: 0.1 },
    },
    panner: {
      coneInnerAngle: { max: 360, min: 0 },
      coneOuterAngle: { max: 360, min: 0 },
      coneOuterGain: { max: 1, min: 0 },
      maxDistance: { max: 10000, min: 1 },
      orientationX: { max: 1, min: -1 },
      orientationY: { max: 1, min: -1 },
      orientationZ: { max: 1, min: -1 },
      positionX: { max: 10, min: -10 },
      positionY: { max: 10, min: -10 },
      positionZ: { max: 10, min: -10 },
      refDistance: { max: 10, min: 0.01 },
      rolloffFactor: { max: 10, min: 0 },
    },
    phaseModulation: {
      depth: { max: Math.PI, min: 0 },
      frequency: { max: 10, min: 0.1 },
    },
    reverb: {
      earlyReflection: {
        delay: { max: 0.5, min: 0 },
        gain: { max: 1, min: 0 },
        phase: { max: 180, min: 0 },
      },
      lateTail: {
        alpha: { max: 0.001, min: 0.00001 },
        amplitude: { max: 0.1, min: 0 },
        delay: { max: 1, min: 0 },
        duration: { max: 10, min: 1 },
      },
      mix: { max: 1, min: 0 },
    },
    waveShaper: {
      distortion: { max: 10, min: 2 },
      fuzz: { max: 100, min: 10 },
      overdrive: { max: 20, min: 1 },
      saturation: { max: 1, min: 0 },
    },
  },
  envelope: {
    attackTime: { max: 0.1, min: 0.001 },
    decayTime: { max: 1, min: 0.01 },
    releaseTime: { max: 10, min: 0.1 },
    silenceGain: { max: 0.001, min: 0.000001 },
    sustainGain: { max: 1, min: 0.1 },
  },
  spectrum: {
    amplitude: { max: 1, min: 0 },
    lambda: { max: 1, min: 0 },
    p: { max: 4, min: 0.5 },
    sigma: { max: 1, min: 0.01 },
  },
  synth: {
    harmonicCount: { max: 20, min: 2 },
    volumeRatio: { max: 1, min: 0 },
  },
} as const;
