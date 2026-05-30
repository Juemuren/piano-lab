import { useCallback } from 'react';
import { downloadBlob, svgToPngBlob } from '../../utils/file';
import type { GetRenderedSvg } from './useRenderedSvg';

function usePngExport(getRenderedSvg: GetRenderedSvg) {
  return useCallback(async () => {
    const renderedSvg = getRenderedSvg();
    if (!renderedSvg) return;

    const blob = await svgToPngBlob(
      renderedSvg.content,
      renderedSvg.width,
      renderedSvg.height,
    );
    if (blob) downloadBlob(blob, 'score.png');
  }, [getRenderedSvg]);
}

export default usePngExport;
