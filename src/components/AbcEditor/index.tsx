import { useCallback, useEffect, useState } from 'react';
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
import { useAbcContent } from '../../contexts/abcContent';
import { usePlayingNotes } from '../../contexts/playingNotes';

const RENDER_TARGET_ID = 'abcjs-paper';

function AbcEditor() {
  const synthEngine = useSynthEngine();
  const { abcContent, setAbcContent } = useAbcContent();
  const { startPlayingNote, endPlayingNote, stopPlayingNotes } =
    usePlayingNotes();
  const [abcPlayer] = useState(
    () => new AbcPlayer(synthEngine, startPlayingNote, endPlayingNote),
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);

  useEffect(() => {
    abcPlayer.init();
  }, [abcPlayer]);

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
    onStop: stopPlayingNotes,
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
      setAbcContent(content);
      setSelectedPresetIndex(-1);
    },
    [setAbcContent],
  );

  const { fileInputRef, openFileDialog, handleFileChange } = useFileImport({
    onImport: handleImport,
  });

  const handlePresetChange = useCallback(
    async (index: number) => {
      setSelectedPresetIndex(index);
      setAbcContent(index >= 0 ? await getAbcPreset(index) : '');
    },
    [setAbcContent],
  );

  const handleContentChange = useCallback(
    (content: string) => {
      setAbcContent(content);
      setSelectedPresetIndex(-1);
    },
    [setAbcContent],
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
