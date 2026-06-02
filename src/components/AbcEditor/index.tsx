import { useCallback, useState } from 'react';
import { getAbcPreset } from '../../services/abc/AbcPresets';
import { AbcPlayer } from '../../services/abc/AbcPlayer';
import AbcFileToolbar from './AbcFileToolbar';
import AbcPlaybackControls from './AbcPlaybackControls';
import AbcPresetSelect from './AbcPresetSelect';
import AbcSourceInput from './AbcSourceInput';
import ControlPanel from '../shared/ControlPanel';
import useFileImport from '../../hooks/file/useFileImport';
import useAbcPlayback from '../../hooks/abc/useAbcPlayback';
import useAbcExports from '../../hooks/abc/useAbcExports';
import { useSynthEngine } from '../../contexts/synthEngine';

const RENDER_TARGET_ID = 'abcjs-paper';

interface AbcEditorProps {
  abcContent: string;
  onNoteStart: (pitch: number) => void;
  onNoteEnd: (pitch: number) => void;
  onStop: () => void;
  onAbcContentChange: (content: string) => void;
}

function AbcEditor({
  abcContent,
  onNoteStart,
  onNoteEnd,
  onStop,
  onAbcContentChange,
}: AbcEditorProps) {
  const synthEngine = useSynthEngine();
  const [abcPlayer] = useState(
    () => new AbcPlayer(synthEngine, onNoteStart, onNoteEnd),
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);
  const {
    isPlaying,
    isPlaybackEnded,
    hasNotes,
    currentSeconds,
    totalSeconds,
    handlePlay,
    handlePause,
    handleReplay,
    handleProgressChange,
  } = useAbcPlayback({
    abcContent,
    abcPlayer,
    onStop,
    renderTargetId: RENDER_TARGET_ID,
  });
  const {
    renderTargetRef,
    handleExportAbc,
    handleExportSvg,
    handleExportPng,
    handleExportPdf,
    handleExportMidi,
  } = useAbcExports(abcContent);

  const handleImport = useCallback(
    (content: string) => {
      onAbcContentChange(content);
      setSelectedPresetIndex(-1);
    },
    [onAbcContentChange],
  );

  const { fileInputRef, openFileDialog, handleFileChange } = useFileImport({
    onImport: handleImport,
  });

  const handlePresetChange = useCallback(
    async (index: number) => {
      setSelectedPresetIndex(index);
      onAbcContentChange(index >= 0 ? await getAbcPreset(index) : '');
    },
    [onAbcContentChange],
  );

  const handleContentChange = useCallback(
    (content: string) => {
      onAbcContentChange(content);
      setSelectedPresetIndex(-1);
    },
    [onAbcContentChange],
  );

  return (
    <ControlPanel>
      <AbcFileToolbar
        fileInputRef={fileInputRef}
        canExportAbc={Boolean(abcContent.trim())}
        canExportRenderedScore={hasNotes}
        onImportClick={openFileDialog}
        onImportChange={handleFileChange}
        onExportAbc={handleExportAbc}
        onExportSvg={handleExportSvg}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        onExportMidi={handleExportMidi}
      />

      <AbcPresetSelect
        selectedPresetIndex={selectedPresetIndex}
        onPresetChange={handlePresetChange}
      />

      <AbcSourceInput value={abcContent} onChange={handleContentChange} />

      {hasNotes && (
        <AbcPlaybackControls
          isPlaying={isPlaying}
          isPlaybackEnded={isPlaybackEnded}
          currentSeconds={currentSeconds}
          totalSeconds={totalSeconds}
          onPlay={handlePlay}
          onPause={handlePause}
          onReplay={handleReplay}
          onProgressChange={handleProgressChange}
        />
      )}

      <div id={RENDER_TARGET_ID} ref={renderTargetRef} className="w-full" />
    </ControlPanel>
  );
}

export default AbcEditor;
