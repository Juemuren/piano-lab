import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ABC_PRESETS, getAbcPreset } from '../services/abc/AbcPresets';
import { AbcPlayer } from '../services/abc/AbcPlayer';
import AbcFileToolbar from './AbcFileToolbar';
import AbcPlaybackControls from './AbcPlaybackControls';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import useFileImport from '../hooks/file/useFileImport';
import useAbcPlayback from '../hooks/abc/useAbcPlayback';
import useAbcExports from '../hooks/abc/useAbcExports';
import { useSynthEngine } from '../contexts/useSynthEngine';

const RENDER_TARGET_ID = 'abcjs-paper';
const INPUT_ID = 'abcjs-input';
const FILE_INPUT_ID = 'abcjs-file-input';

interface AbcEditorProps {
  onNoteStart: (pitch: number) => void;
  onNoteEnd: (pitch: number) => void;
  onStop: () => void;
}

function AbcEditor({ onNoteStart, onNoteEnd, onStop }: AbcEditorProps) {
  const { t } = useTranslation(['common', 'piano']);
  const synthEngine = useSynthEngine();
  const [abcPlayer] = useState(
    () => new AbcPlayer(synthEngine, onNoteStart, onNoteEnd),
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);
  const [abcContent, setAbcContent] = useState('');
  const {
    isPlaying,
    hasNotes,
    currentBeat,
    totalBeats,
    handlePlay,
    handleStop,
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
      setAbcContent(content);
      setSelectedPresetIndex(-1);
      if (isPlaying) handleStop();
    },
    [handleStop, isPlaying],
  );

  const { fileInputRef, openFileDialog, handleFileChange } = useFileImport({
    onImport: handleImport,
  });

  return (
    <ControlPanel>
      <AbcFileToolbar
        fileInputId={FILE_INPUT_ID}
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

      <ControlSelect
        value={selectedPresetIndex}
        onChange={async (e) => {
          const index = parseInt(e.target.value);
          setSelectedPresetIndex(index);
          if (index >= 0) {
            const content = await getAbcPreset(index);
            setAbcContent(content);
            if (isPlaying) handleStop();
          } else {
            setAbcContent('');
          }
          if (isPlaying) handleStop();
        }}
      >
        <option value={-1}>{t('piano:score.custom')}</option>
        {ABC_PRESETS.map((name, index) => (
          <option key={index} value={index}>
            {t(`piano:score.presets.${name}`)}
          </option>
        ))}
      </ControlSelect>

      <textarea
        id={INPUT_ID}
        value={abcContent}
        onChange={(e) => {
          setAbcContent(e.target.value);
          setSelectedPresetIndex(-1);
          if (isPlaying) handleStop();
        }}
        placeholder={t('piano:score.placeholder')}
        className="
          w-full h-48 p-4 my-2 text-sm
          bg-app-surface-muted/75 dark:bg-app-surface-muted-dark/25
          border border-app-border dark:border-app-border-dark
          focus:outline-none focus:ring-2 focus:ring-app-accent/50
        "
      />

      {hasNotes && (
        <AbcPlaybackControls
          isPlaying={isPlaying}
          currentBeat={currentBeat}
          totalBeats={totalBeats}
          onPlay={handlePlay}
          onStop={handleStop}
          onProgressChange={handleProgressChange}
        />
      )}

      <div id={RENDER_TARGET_ID} ref={renderTargetRef} className="w-full" />
    </ControlPanel>
  );
}

export default AbcEditor;
