import type {
  EqualizerConfig,
  FilterConfig,
  FilterEqualizerConfig,
} from '../FilterEqualizer';

function configureFilter(node: BiquadFilterNode, config: FilterConfig) {
  node.type = config.type;
  node.frequency.value = config.frequency;
  node.Q.value = config.q;
}

function configureEqualizer(node: BiquadFilterNode, config: EqualizerConfig) {
  node.type = config.type;
  node.frequency.value = config.frequency;
  node.Q.value = config.q;
  node.gain.value = config.gain;
}

export class FilterEqualizerRuntime {
  private audioContext: AudioContext;
  private filterNodes: BiquadFilterNode[] = [];
  private equalizerNodes: BiquadFilterNode[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  configure(config: FilterEqualizerConfig) {
    config.filters.forEach((filter, index) => {
      const node = this.filterNodes[index];
      if (node) configureFilter(node, filter);
    });
    config.equalizers.forEach((equalizer, index) => {
      const node = this.equalizerNodes[index];
      if (node) configureEqualizer(node, equalizer);
    });
  }

  connect(inputNode: AudioNode, config: FilterEqualizerConfig) {
    let previousNode = inputNode;

    this.filterNodes = config.filters.map((filter, index) => {
      const node =
        this.filterNodes[index] ?? this.audioContext.createBiquadFilter();
      configureFilter(node, filter);
      previousNode.connect(node);
      previousNode = node;
      return node;
    });
    this.equalizerNodes = config.equalizers.map((equalizer, index) => {
      const node =
        this.equalizerNodes[index] ?? this.audioContext.createBiquadFilter();
      configureEqualizer(node, equalizer);
      previousNode.connect(node);
      previousNode = node;
      return node;
    });

    return previousNode;
  }

  disconnect() {
    for (const node of [...this.filterNodes, ...this.equalizerNodes]) {
      node.disconnect();
    }
  }
}
