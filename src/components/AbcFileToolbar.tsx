import { type ChangeEventHandler, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import FileExportButton from './shared/FileExportButton';
import FileImportButton from './shared/FileImportButton';

interface AbcFileToolbarProps {
  fileInputId: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  canExportAbc: boolean;
  canExportRenderedScore: boolean;
  onImportClick: () => void;
  onImportChange: ChangeEventHandler<HTMLInputElement>;
  onExportAbc: () => void;
  onExportSvg: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onExportMidi: () => void;
}

function AbcFileToolbar({
  fileInputId,
  fileInputRef,
  canExportAbc,
  canExportRenderedScore,
  onImportClick,
  onImportChange,
  onExportAbc,
  onExportSvg,
  onExportPng,
  onExportPdf,
  onExportMidi,
}: AbcFileToolbarProps) {
  const { t } = useTranslation('piano');

  return (
    <div className="pb-2 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
      <FileImportButton
        fileInputId={fileInputId}
        fileInputRef={fileInputRef}
        accept=".abc,text/vnd.abc,text/plain"
        label={t('score.importAbc')}
        onClick={onImportClick}
        onChange={onImportChange}
      />
      <FileExportButton
        label={t('score.exportAbc')}
        disabled={!canExportAbc}
        onClick={onExportAbc}
      />
      <FileExportButton
        label={t('score.exportSvg')}
        disabled={!canExportRenderedScore}
        onClick={onExportSvg}
      />
      <FileExportButton
        label={t('score.exportPng')}
        disabled={!canExportRenderedScore}
        onClick={onExportPng}
      />
      <FileExportButton
        label={t('score.exportPdf')}
        disabled={!canExportRenderedScore}
        onClick={onExportPdf}
      />
      <FileExportButton
        label={t('score.exportMidi')}
        disabled={!canExportRenderedScore}
        onClick={onExportMidi}
      />
    </div>
  );
}

export default AbcFileToolbar;
