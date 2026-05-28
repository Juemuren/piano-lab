export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export const getSvgDimensions = (svgElement: SVGSVGElement) => {
  const viewBox = svgElement.viewBox.baseVal;
  const width = svgElement.width.baseVal.value || viewBox.width;
  const height = svgElement.height.baseVal.value || viewBox.height;

  return {
    width: Math.ceil(width || svgElement.getBoundingClientRect().width),
    height: Math.ceil(height || svgElement.getBoundingClientRect().height),
  };
};
