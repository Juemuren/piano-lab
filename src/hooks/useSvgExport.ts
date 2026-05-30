import { useCallback } from 'react';
import { downloadBlob } from '../utils/file';
import type { GetRenderedSvg } from './useRenderedSvg';

function useSvgExport(getRenderedSvg: GetRenderedSvg) {
  return useCallback(() => {
    const renderedSvg = getRenderedSvg();
    if (!renderedSvg) return;

    const blob = new Blob([renderedSvg.content], {
      type: 'image/svg+xml;charset=utf-8',
    });

    downloadBlob(blob, 'score.svg');
  }, [getRenderedSvg]);
}

export default useSvgExport;
