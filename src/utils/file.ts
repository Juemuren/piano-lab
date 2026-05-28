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

export const svgToPngBlob = (
  svgContent: string,
  width: number,
  height: number,
): Promise<Blob | null> =>
  new Promise((resolve) => {
    const svgBlob = new Blob([svgContent], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    const revokeSvgUrl = () => URL.revokeObjectURL(svgUrl);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      if (!context) {
        revokeSvgUrl();
        resolve(null);
        return;
      }

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      revokeSvgUrl();

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    };

    image.onerror = () => {
      revokeSvgUrl();
      resolve(null);
    };

    image.src = svgUrl;
  });
