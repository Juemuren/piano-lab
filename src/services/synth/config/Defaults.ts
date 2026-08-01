export const SYNTH_CONFIG_DEFAULTS = {
  effect: {
    amplitudeModulation: {
      depth: 0.25,
      frequency: 5,
    },
    compressor: {
      attack: 0.005,
      knee: 30,
      ratio: 15,
      release: 0.25,
      threshold: -20,
    },
    delayModulation: {
      depth: 0.008,
      frequency: 0.3,
    },
    filterEqualizer: {
      equalizer: {
        frequency: 1000,
        gain: 0,
        q: 1,
        type: 'lowshelf',
      },
      filter: {
        frequency: 1000,
        q: 1,
        type: 'lowpass',
      },
      preset: 'classical',
    },
    frequencyModulation: {
      depth: 20,
      frequency: 5,
    },
    panner: {
      coneInnerAngle: 60,
      coneOuterAngle: 120,
      coneOuterGain: 0.5,
      distanceModel: 'inverse',
      maxDistance: 10000,
      orientationX: 0,
      orientationY: 0,
      orientationZ: 1,
      panningModel: 'equalpower',
      positionX: 0,
      positionY: 0,
      positionZ: -1,
      refDistance: 1,
      rolloffFactor: 1,
    },
    phaseModulation: {
      depth: 0.5,
      frequency: 0.5,
    },
    reverb: {
      earlyReflection: {
        delay: 0.01,
        gain: 0.2,
        phase: 0,
      },
      mix: 0,
      preset: 'bathroom',
    },
    waveShaper: {
      distortion: 5,
      fuzz: 40,
      overdrive: 8,
      preset: 'saturation',
      saturation: 0.5,
    },
  },
  envelope: {
    attackTime: 0.01,
    decayTime: 0.2,
    releaseTime: 0.8,
    silenceGain: 0.00001,
    sustainGain: 0.5,
  },
  spectrum: {
    lambda: 0.5,
    p: 1.5,
    sigma: 0.8,
    type: 'ethereal',
  },
  synth: {
    harmonicCount: 10,
    oscillatorType: 'sine',
    volumeRatio: 0.2,
  },
} as const;
