export function createSeededUniformRandomGenerator(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function createSeededGaussianRandomGenerator(seed: number) {
  const getUniformRandom = createSeededUniformRandomGenerator(seed);
  let spare: number | null = null;

  return () => {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }

    let u = getUniformRandom();
    let v = getUniformRandom();

    while (u === 0) {
      u = getUniformRandom();
    }

    while (v === 0) {
      v = getUniformRandom();
    }

    const magnitude = Math.sqrt(-2 * Math.log(u));
    const angle = Math.PI * 2 * v;

    spare = magnitude * Math.sin(angle);
    return magnitude * Math.cos(angle);
  };
}
