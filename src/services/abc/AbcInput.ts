import { getAbcPitch } from '../../utils/pitch';

export function appendPitchToAbc(content: string, pitch: number) {
  const note = getAbcPitch(pitch);
  const trimmedEnd = content.trimEnd();

  return `${trimmedEnd}${trimmedEnd ? ' ' : ''}${note} `;
}
