import { useCallback, useRef } from 'react';
import { downloadBlob, getSvgDimensions, svgToPngBlob } from '../utils/file';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

interface RenderedSvg {
  content: string;
  width: number;
  height: number;
}

function useRenderedScoreExport() {
  const renderTargetRef = useRef<HTMLDivElement>(null);

  const getRenderedSvg = useCallback((): RenderedSvg | null => {
    const svgElement = renderTargetRef.current?.querySelector('svg');

    if (!svgElement) return null;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('xmlns', SVG_NAMESPACE);

    const { width, height } = getSvgDimensions(svgElement);
    clonedSvg.setAttribute('width', width.toString());
    clonedSvg.setAttribute('height', height.toString());

    return {
      content: new XMLSerializer().serializeToString(clonedSvg),
      width,
      height,
    };
  }, []);

  const handleExportSvg = useCallback(() => {
    const renderedSvg = getRenderedSvg();
    if (!renderedSvg) return;

    const blob = new Blob([renderedSvg.content], {
      type: 'image/svg+xml;charset=utf-8',
    });

    downloadBlob(blob, 'score.svg');
  }, [getRenderedSvg]);

  const handleExportPng = useCallback(async () => {
    const renderedSvg = getRenderedSvg();
    if (!renderedSvg) return;

    const blob = await svgToPngBlob(
      renderedSvg.content,
      renderedSvg.width,
      renderedSvg.height,
    );
    if (blob) downloadBlob(blob, 'score.png');
  }, [getRenderedSvg]);

  return {
    renderTargetRef,
    handleExportSvg,
    handleExportPng,
  };
}

export default useRenderedScoreExport;
