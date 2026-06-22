import { useCallback, useRef } from 'react';
import { getSvgDimensions } from '../../utils/file';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export interface RenderedSvg {
  content: string;
  height: number;
  width: number;
}

export type GetRenderedSvg = () => RenderedSvg | null;

const cloneSvg = (svgElement: SVGSVGElement) => {
  const clonedSvg = svgElement.cloneNode(true);

  if (!(clonedSvg instanceof SVGSVGElement)) {
    return null;
  }

  clonedSvg.setAttribute('xmlns', SVG_NAMESPACE);
  return clonedSvg;
};

const getSingleRenderedSvg = (
  svgElement: SVGSVGElement,
): RenderedSvg | null => {
  const clonedSvg = cloneSvg(svgElement);

  if (!clonedSvg) return null;

  const { width, height } = getSvgDimensions(svgElement);
  clonedSvg.setAttribute('width', width.toString());
  clonedSvg.setAttribute('height', height.toString());

  return {
    content: new XMLSerializer().serializeToString(clonedSvg),
    height,
    width,
  };
};

const getCombinedRenderedSvg = (
  svgElements: SVGSVGElement[],
): RenderedSvg | null => {
  const renderedLines = svgElements
    .map((svgElement) => ({
      dimensions: getSvgDimensions(svgElement),
      svgElement,
    }))
    .filter(({ dimensions }) => dimensions.width > 0 && dimensions.height > 0);

  if (renderedLines.length === 0) return null;
  if (renderedLines.length === 1) {
    return getSingleRenderedSvg(renderedLines[0].svgElement);
  }

  const width = Math.max(
    ...renderedLines.map(({ dimensions }) => dimensions.width),
  );
  const height = renderedLines.reduce(
    (total, { dimensions }) => total + dimensions.height,
    0,
  );
  const combinedSvg = document.createElementNS(SVG_NAMESPACE, 'svg');
  let offsetY = 0;

  combinedSvg.setAttribute('xmlns', SVG_NAMESPACE);
  combinedSvg.setAttribute('width', width.toString());
  combinedSvg.setAttribute('height', height.toString());
  combinedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  renderedLines.forEach(({ svgElement, dimensions }) => {
    const clonedSvg = cloneSvg(svgElement);

    if (!clonedSvg) return;

    clonedSvg.setAttribute('x', '0');
    clonedSvg.setAttribute('y', offsetY.toString());
    clonedSvg.setAttribute('width', dimensions.width.toString());
    clonedSvg.setAttribute('height', dimensions.height.toString());
    combinedSvg.appendChild(clonedSvg);
    offsetY += dimensions.height;
  });

  return {
    content: new XMLSerializer().serializeToString(combinedSvg),
    height,
    width,
  };
};

function useRenderedSvg() {
  const renderTargetRef = useRef<HTMLDivElement>(null);

  const getRenderedSvg = useCallback((): RenderedSvg | null => {
    const svgElements = Array.from(
      renderTargetRef.current?.querySelectorAll('svg') ?? [],
    ).filter((element): element is SVGSVGElement => {
      return element instanceof SVGSVGElement;
    });

    return getCombinedRenderedSvg(svgElements);
  }, []);

  return {
    getRenderedSvg,
    renderTargetRef,
  };
}

export default useRenderedSvg;
