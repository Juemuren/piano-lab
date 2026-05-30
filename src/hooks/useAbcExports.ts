import { useCallback } from 'react';
import useFileExport from './useFileExport';
import useMidiExport from './useMidiExport';
import useRenderedScoreExport from './useRenderedScoreExport';

function useAbcScoreExports(abcContent: string) {
  const { renderTargetRef, handleExportSvg, handleExportPng, handlePrintPdf } =
    useRenderedScoreExport();
  const handleExportAbc = useFileExport({
    content: abcContent,
    fileName: 'score.abc',
    mimeType: 'text/vnd.abc;charset=utf-8',
  });
  const handleExportMidi = useMidiExport(abcContent);

  const handleExportPdf = useCallback(() => {
    handlePrintPdf(abcContent);
  }, [abcContent, handlePrintPdf]);

  return {
    renderTargetRef,
    handleExportAbc,
    handleExportSvg,
    handleExportPng,
    handleExportPdf,
    handleExportMidi,
  };
}

export default useAbcScoreExports;
