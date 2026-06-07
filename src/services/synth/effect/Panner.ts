import type { PannerConfig } from '../../../types';

const DEGREE_TO_RADIAN = Math.PI / 180;
const DISTANCE_POINT_COUNT = 160;

export function getPannerDistance(config: PannerConfig) {
  return Math.hypot(config.positionX, config.positionY, config.positionZ);
}

export function getPannerDistanceGain(config: PannerConfig, distance: number) {
  const refDistance = Math.max(config.refDistance, 0.01);
  const maxDistance = Math.max(config.maxDistance, refDistance + 0.01);
  const rolloffFactor = Math.max(config.rolloffFactor, 0);
  const clampedDistance = Math.min(
    Math.max(distance, refDistance),
    maxDistance,
  );

  if (config.distanceModel === 'linear') {
    const gain =
      1 -
      (rolloffFactor * (clampedDistance - refDistance)) /
        (maxDistance - refDistance);

    return Math.min(Math.max(gain, 0), 1);
  }

  if (config.distanceModel === 'exponential') {
    return (clampedDistance / refDistance) ** -rolloffFactor;
  }

  return (
    refDistance /
    (refDistance + rolloffFactor * (clampedDistance - refDistance))
  );
}

export function getPannerDistanceCurve(config: PannerConfig) {
  const refDistance = Math.max(config.refDistance, 0.01);
  const maxDistance = Math.max(config.maxDistance, refDistance + 0.01);
  const previewMaxDistance = Math.min(
    maxDistance,
    Math.max(refDistance * 4, 20),
  );

  const distances = Array.from({ length: DISTANCE_POINT_COUNT }, (_, index) => {
    const progress = index / (DISTANCE_POINT_COUNT - 1);
    return previewMaxDistance * progress;
  });

  return {
    distances,
    gains: distances.map((distance) => getPannerDistanceGain(config, distance)),
  };
}

function normalizeVector(x: number, z: number) {
  const length = Math.hypot(x, z);

  if (length === 0) {
    return { x: 0, z: -1 };
  }

  return {
    x: x / length,
    z: z / length,
  };
}

export function getPannerConePolygon(
  config: PannerConfig,
  angle: number,
  radius: number,
) {
  const direction = normalizeVector(config.orientationX, config.orientationZ);
  const directionAngle = Math.atan2(direction.z, direction.x);
  const halfAngle = Math.min(Math.max(angle / 2, 0), 180) * DEGREE_TO_RADIAN;
  const sampleCount = Math.max(8, Math.ceil(angle / 6));
  const x = [config.positionX];
  const z = [config.positionZ];

  for (let index = 0; index <= sampleCount; index += 1) {
    const progress = index / sampleCount;
    const pointAngle = directionAngle - halfAngle + halfAngle * 2 * progress;

    x.push(config.positionX + Math.cos(pointAngle) * radius);
    z.push(config.positionZ + Math.sin(pointAngle) * radius);
  }

  x.push(config.positionX);
  z.push(config.positionZ);

  return { x, z };
}
