import { BookImage, Download, Image, Music, Upload } from 'lucide-react';
import type { ChangeEventHandler, RefObject } from 'react';
import ControlButton from '../shared/ControlButton';
import FileImportButton from '../shared/FileImportButton';

interface AbcFileToolbarProps {
  canExportAbc: boolean;
  canExportRenderedScore: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onExportAbc: () => void;
  onExportMidi: () => void;
  onExportPdf: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onImportChange: ChangeEventHandler<HTMLInputElement>;
  onImportClick: () => void;
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
        accept=".abc,text/vnd.abc,text/plain"
        fileInputRef={fileInputRef}
        icon={<Upload size={18} />}
        label="ABC"
        onChange={onImportChange}
        onClick={onImportClick}
      />
      <ControlButton
        disabled={!canExportAbc}
        icon={<Download size={18} />}
        label="ABC"
        onClick={onExportAbc}
      />
      <ControlButton
        disabled={!canExportRenderedScore}
        icon={<Image size={18} />}
        label="SVG"
        onClick={onExportSvg}
      />
      <ControlButton
        disabled={!canExportRenderedScore}
        icon={<Image size={18} />}
        label="PNG"
        onClick={onExportPng}
      />
      <ControlButton
        disabled={!canExportRenderedScore}
        icon={<BookImage size={18} />}
        label="PDF"
        onClick={onExportPdf}
      />
      <ControlButton
        disabled={!canExportRenderedScore}
        icon={<Music size={18} />}
        label="MIDI"
        onClick={onExportMidi}
      />
    </div>
  );
}

export default AbcFileToolbar;
