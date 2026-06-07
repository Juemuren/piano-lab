import type { PannerConfig } from '../../../types';

const DEGREE_TO_RADIAN = Math.PI / 180;
const DISTANCE_POINT_COUNT = 160;
const CONE_SEGMENT_COUNT = 48;
const SPHERE_LATITUDE_COUNT = 12;
const SPHERE_LONGITUDE_COUNT = 24;

export interface PannerConeMesh {
  x: number[];
  y: number[];
  z: number[];
  i: number[];
  j: number[];
  k: number[];
}

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

function normalizeVector3D(x: number, y: number, z: number) {
  const length = Math.hypot(x, y, z);

  if (length === 0) {
    return { x: 0, y: 0, z: 1 };
  }

  return {
    x: x / length,
    y: y / length,
    z: z / length,
  };
}

function cross(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function createDirectionBasis(direction: { x: number; y: number; z: number }) {
  const helper =
    Math.abs(direction.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  const rawRight = cross(direction, helper);
  const right = normalizeVector3D(rawRight.x, rawRight.y, rawRight.z);
  const rawUp = cross(right, direction);
  const up = normalizeVector3D(rawUp.x, rawUp.y, rawUp.z);

  return { right, up };
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

function getPannerConeSphereMesh(config: PannerConfig, radius: number) {
  const mesh: PannerConeMesh = {
    x: [],
    y: [],
    z: [],
    i: [],
    j: [],
    k: [],
  };

  for (let latIndex = 0; latIndex <= SPHERE_LATITUDE_COUNT; latIndex += 1) {
    const phi = Math.PI * (latIndex / SPHERE_LATITUDE_COUNT);

    for (let lonIndex = 0; lonIndex <= SPHERE_LONGITUDE_COUNT; lonIndex += 1) {
      const theta = Math.PI * 2 * (lonIndex / SPHERE_LONGITUDE_COUNT);

      mesh.x.push(config.positionX + Math.sin(phi) * Math.cos(theta) * radius);
      mesh.y.push(config.positionY + Math.cos(phi) * radius);
      mesh.z.push(config.positionZ + Math.sin(phi) * Math.sin(theta) * radius);
    }
  }

  const rowLength = SPHERE_LONGITUDE_COUNT + 1;
  for (let latIndex = 0; latIndex < SPHERE_LATITUDE_COUNT; latIndex += 1) {
    for (let lonIndex = 0; lonIndex < SPHERE_LONGITUDE_COUNT; lonIndex += 1) {
      const current = latIndex * rowLength + lonIndex;
      const next = current + rowLength;

      mesh.i.push(current, current + 1);
      mesh.j.push(next, next);
      mesh.k.push(current + 1, next + 1);
    }
  }

  return mesh;
}

function getPannerWideConeMesh(
  config: PannerConfig,
  direction: { x: number; y: number; z: number },
  angle: number,
  radius: number,
) {
  const { right, up } = createDirectionBasis(direction);
  const halfAngle = Math.min(Math.max(angle / 2, 0), 180) * DEGREE_TO_RADIAN;
  const mesh: PannerConeMesh = {
    x: [],
    y: [],
    z: [],
    i: [],
    j: [],
    k: [],
  };

  for (let latIndex = 0; latIndex <= SPHERE_LATITUDE_COUNT; latIndex += 1) {
    const phi = halfAngle * (latIndex / SPHERE_LATITUDE_COUNT);
    const forwardScale = Math.cos(phi);
    const radialScale = Math.sin(phi);

    for (let lonIndex = 0; lonIndex <= SPHERE_LONGITUDE_COUNT; lonIndex += 1) {
      const theta = Math.PI * 2 * (lonIndex / SPHERE_LONGITUDE_COUNT);
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const x =
        direction.x * forwardScale + (right.x * cos + up.x * sin) * radialScale;
      const y =
        direction.y * forwardScale + (right.y * cos + up.y * sin) * radialScale;
      const z =
        direction.z * forwardScale + (right.z * cos + up.z * sin) * radialScale;

      mesh.x.push(config.positionX + x * radius);
      mesh.y.push(config.positionY + y * radius);
      mesh.z.push(config.positionZ + z * radius);
    }
  }

  const rowLength = SPHERE_LONGITUDE_COUNT + 1;
  for (let latIndex = 0; latIndex < SPHERE_LATITUDE_COUNT; latIndex += 1) {
    for (let lonIndex = 0; lonIndex < SPHERE_LONGITUDE_COUNT; lonIndex += 1) {
      const current = latIndex * rowLength + lonIndex;
      const next = current + rowLength;

      mesh.i.push(current, current + 1);
      mesh.j.push(next, next);
      mesh.k.push(current + 1, next + 1);
    }
  }

  return mesh;
}

export function getPannerConeMesh(
  config: PannerConfig,
  angle: number,
  radius: number,
) {
  if (angle >= 359) {
    return getPannerConeSphereMesh(config, radius);
  }

  const direction = normalizeVector3D(
    config.orientationX,
    config.orientationY,
    config.orientationZ,
  );

  if (angle >= 180) {
    return getPannerWideConeMesh(config, direction, angle, radius);
  }

  const { right, up } = createDirectionBasis(direction);
  const halfAngle = Math.min(Math.max(angle / 2, 0), 90) * DEGREE_TO_RADIAN;
  const baseDistance = Math.cos(halfAngle) * radius;
  const baseRadius = Math.sin(halfAngle) * radius;
  const mesh: PannerConeMesh = {
    x: [config.positionX],
    y: [config.positionY],
    z: [config.positionZ],
    i: [],
    j: [],
    k: [],
  };
  const baseCenter = {
    x: config.positionX + direction.x * baseDistance,
    y: config.positionY + direction.y * baseDistance,
    z: config.positionZ + direction.z * baseDistance,
  };

  for (let index = 0; index < CONE_SEGMENT_COUNT; index += 1) {
    const angle = Math.PI * 2 * (index / CONE_SEGMENT_COUNT);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    mesh.x.push(baseCenter.x + (right.x * cos + up.x * sin) * baseRadius);
    mesh.y.push(baseCenter.y + (right.y * cos + up.y * sin) * baseRadius);
    mesh.z.push(baseCenter.z + (right.z * cos + up.z * sin) * baseRadius);
  }

  for (let index = 1; index <= CONE_SEGMENT_COUNT; index += 1) {
    const nextIndex = index === CONE_SEGMENT_COUNT ? 1 : index + 1;

    mesh.i.push(0);
    mesh.j.push(index);
    mesh.k.push(nextIndex);
  }

  return mesh;
}
