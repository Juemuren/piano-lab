import useFileExport from '../file/useFileExport';
import useMidiExport from './useMidiExport';
import usePdfExport from './usePdfExport';
import usePngExport from './usePngExport';
import useRenderedSvg from './useRenderedSvg';
import useSvgExport from './useSvgExport';

function useAbcExports(abcContent: string) {
  const { renderTargetRef, getRenderedSvg } = useRenderedSvg();
  const handleExportAbc = useFileExport({
    content: abcContent,
    fileName: 'score.abc',
    mimeType: 'text/vnd.abc',
  });
  const handleExportSvg = useSvgExport(getRenderedSvg);
  const handleExportPng = usePngExport(getRenderedSvg);
  const handleExportPdf = usePdfExport();
  const handleExportMidi = useMidiExport(abcContent);

  return {
    handleExportAbc,
    handleExportMidi,
    handleExportPdf,
    handleExportPng,
    handleExportSvg,
    renderTargetRef,
  };
}

export default useAbcExports;
