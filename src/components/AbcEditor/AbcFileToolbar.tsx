import { type ChangeEventHandler, type RefObject } from 'react';
import { Upload, Download, Image, BookImage, Music } from 'lucide-react';
import FileExportButton from '../shared/FileExportButton';
import FileImportButton from '../shared/FileImportButton';

interface AbcFileToolbarProps {
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
  return (
    <div className="pb-2 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
      <FileImportButton
        fileInputRef={fileInputRef}
        accept=".abc,text/vnd.abc,text/plain"
        label="ABC"
        icon={<Upload size={18} />}
        onClick={onImportClick}
        onChange={onImportChange}
      />
      <FileExportButton
        label="ABC"
        icon={<Download size={18} />}
        disabled={!canExportAbc}
        onClick={onExportAbc}
      />
      <FileExportButton
        label="SVG"
        icon={<Image size={18} />}
        disabled={!canExportRenderedScore}
        onClick={onExportSvg}
      />
      <FileExportButton
        label="PNG"
        icon={<Image size={18} />}
        disabled={!canExportRenderedScore}
        onClick={onExportPng}
      />
      <FileExportButton
        label="PDF"
        icon={<BookImage size={18} />}
        disabled={!canExportRenderedScore}
        onClick={onExportPdf}
      />
      <FileExportButton
        label="MIDI"
        icon={<Music size={18} />}
        disabled={!canExportRenderedScore}
        onClick={onExportMidi}
      />
    </div>
  );
}

export default AbcFileToolbar;
