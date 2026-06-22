interface SaveFilePickerOptions {
  startIn?: 'downloads';
  suggestedName?: string;
  types?: {
    description: string;
    accept: Record<string, string[]>;
  }[];
}

interface WindowWithSaveFilePicker extends Window {
  showSaveFilePicker?: (
    options?: SaveFilePickerOptions,
  ) => Promise<FileSystemFileHandle>;
}

const getFileExtension = (fileName: string) => {
  const extensionStart = fileName.lastIndexOf('.');

  return extensionStart > 0 ? fileName.slice(extensionStart) : '';
};

const getFileMimeType = (blob: Blob) => blob.type.split(';')[0];

const getSaveFilePickerOptions = (
  blob: Blob,
  fileName: string,
): SaveFilePickerOptions => {
  const extension = getFileExtension(fileName);
  const mimeType = getFileMimeType(blob);

  if (!mimeType || !extension)
    return { startIn: 'downloads', suggestedName: fileName };

  return {
    startIn: 'downloads',
    suggestedName: fileName,
    types: [
      {
        accept: {
          [mimeType]: [extension],
        },
        description: `${extension.slice(1).toUpperCase()} file`,
      },
    ],
  };
};

const downloadBlobWithLink = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const downloadBlob = async (blob: Blob, fileName: string) => {
  const saveFilePicker = (window as WindowWithSaveFilePicker)
    .showSaveFilePicker;

  if (window.isSecureContext && saveFilePicker) {
    try {
      const fileHandle = await saveFilePicker(
        getSaveFilePickerOptions(blob, fileName),
      );
      const writable = await fileHandle.createWritable();

      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }

  downloadBlobWithLink(blob, fileName);
};

export const getSvgDimensions = (svgElement: SVGSVGElement) => {
  const viewBox = svgElement.viewBox.baseVal;
  const width = svgElement.width.baseVal.value || viewBox.width;
  const height = svgElement.height.baseVal.value || viewBox.height;

  return {
    height: Math.ceil(height || svgElement.getBoundingClientRect().height),
    width: Math.ceil(width || svgElement.getBoundingClientRect().width),
  };
};

export const svgToPngBlob = (
  svgContent: string,
  width: number,
  height: number,
): Promise<Blob | null> =>
  new Promise((resolve) => {
    const svgBlob = new Blob([svgContent], {
      type: 'image/svg+xml',
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
