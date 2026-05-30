import { useCallback, useRef } from 'react';
import { getSvgDimensions } from '../utils/file';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export interface RenderedSvg {
  content: string;
  width: number;
  height: number;
}

export type GetRenderedSvg = () => RenderedSvg | null;

function useRenderedSvg() {
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

  return {
    renderTargetRef,
    getRenderedSvg,
  };
}

export default useRenderedSvg;
