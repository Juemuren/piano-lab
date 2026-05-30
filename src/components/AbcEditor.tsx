import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ABC_PRESETS, getAbcPreset } from '../services/abc/AbcPresets';
import { AudioEngine } from '../services/audio/AudioEngine';
import { AbcPlayer } from '../services/abc/AbcPlayer';
import ControlPanel from './shared/ControlPanel';
import ControlSelect from './shared/ControlSelect';
import FileExportButton from './shared/FileExportButton';
import FileImportButton from './shared/FileImportButton';
import useFileExport from '../hooks/useFileExport';
import useFileImport from '../hooks/useFileImport';
import useAbcPlayback from '../hooks/useAbcPlayback';
import useRenderedScoreExport from '../hooks/useRenderedScoreExport';

const RENDER_TARGET_ID = 'abcjs-paper';
const INPUT_ID = 'abcjs-input';
const FILE_INPUT_ID = 'abcjs-file-input';

interface AbcEditorProps {
  audioEngine: AudioEngine;
  onNoteStart: (pitch: number) => void;
  onNoteEnd: (pitch: number) => void;
  onStop: () => void;
}

function AbcEditor({
  audioEngine,
  onNoteStart,
  onNoteEnd,
  onStop,
}: AbcEditorProps) {
  const { t } = useTranslation(['common', 'piano']);
  const [abcPlayer] = useState(
    () => new AbcPlayer(audioEngine, onNoteStart, onNoteEnd),
  );
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(-1);
  const [abcContent, setAbcContent] = useState('');
  const { isPlaying, hasNotes, handlePlay, handleStop } = useAbcPlayback({
    abcContent,
    abcPlayer,
    onStop,
    renderTargetId: RENDER_TARGET_ID,
  });
  const { renderTargetRef, handleExportSvg, handleExportPng } =
    useRenderedScoreExport();

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
  const handleExportAbc = useFileExport({
    content: abcContent,
    fileName: 'score.abc',
    mimeType: 'text/vnd.abc;charset=utf-8',
  });

  return (
    <ControlPanel>
      <div className="pb-2 grid gap-2 grid-cols-2 sm:grid-cols-4">
        <FileImportButton
          fileInputId={FILE_INPUT_ID}
          fileInputRef={fileInputRef}
          accept=".abc,text/vnd.abc,text/plain"
          label={t('piano:score.importAbc')}
          onClick={openFileDialog}
          onChange={handleFileChange}
        />
        <FileExportButton
          label={t('piano:score.exportAbc')}
          disabled={!abcContent.trim()}
          onClick={handleExportAbc}
        />
        <FileExportButton
          label={t('piano:score.exportSvg')}
          disabled={!hasNotes}
          onClick={handleExportSvg}
        />
        <FileExportButton
          label={t('piano:score.exportPng')}
          disabled={!hasNotes}
          onClick={handleExportPng}
        />
      </div>

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

      <div className="flex justify-center">
        {hasNotes && (
          <button
            onClick={isPlaying ? handleStop : handlePlay}
            className={`
              w-full py-2 rounded-xl text-app-on-accent transition-colors
              ${
                isPlaying
                  ? 'bg-app-danger hover:bg-app-danger-strong'
                  : 'bg-app-success hover:bg-app-success-strong'
              }
            `}
          >
            {isPlaying ? t('common:actions.stop') : t('common:actions.play')}
          </button>
        )}
      </div>

      <div id={RENDER_TARGET_ID} ref={renderTargetRef} className="w-full" />
    </ControlPanel>
  );
}

export default AbcEditor;
