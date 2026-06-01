import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from './components/shared/CollapsibleSection';
import Piano from './components/Piano';
import SoundSynthesizer from './components/SoundSynthesizer';
import AbcEditor from './components/AbcEditor';
import SettingsPanel from './components/SettingsPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAppSettings } from './contexts/useAppSettings';
import { appendPitchToAbc } from './services/abc/AbcInput';
import type { MidiControlState } from './hooks/piano/useMidiControl';

const initialMidiControlState: MidiControlState = {
  activeNotes: new Set(),
  devices: [],
  activeInputId: '',
  status: 'idle',
};

function App() {
  const { t } = useTranslation('app');
  const { isPianoInputEnabled } = useAppSettings();
  const [playingNotes, setPlayingNotes] = useState<Set<number>>(new Set());
  const [abcContent, setAbcContent] = useState('');
  const [midiControl, setMidiControl] = useState<MidiControlState>(
    initialMidiControlState,
  );
  const [selectedMidiInputId, setSelectedMidiInputId] = useState('');

  const handleNoteStart = useCallback((pitch: number) => {
    setPlayingNotes((prev) => {
      const next = new Set(prev);
      next.add(pitch);
      return next;
    });
  }, []);

  const handleNoteEnd = useCallback((pitch: number) => {
    setPlayingNotes((prev) => {
      const next = new Set(prev);
      next.delete(pitch);
      return next;
    });
  }, []);

  const handleStopPlayingNotes = useCallback(() => {
    setPlayingNotes(new Set());
  }, []);

  const handlePianoNoteInput = useCallback((pitch: number) => {
    setAbcContent((content) => appendPitchToAbc(content, pitch));
  }, []);

  return (
    <>
      <Header />

      <main
        className="
          w-full min-h-screen mx-auto p-5
          flex flex-col grow justify-center gap-5
          bg-app-bg dark:bg-app-bg-dark
          text-app-text dark:text-app-text-dark
        "
      >
        <h1 className="text-center text-3xl font-bold">{t('title')}</h1>

        <div
          className="
            flex flex-col items-center gap-5
            xl:flex-row xl:items-start xl:justify-center
          "
        >
          <section
            id="sound-synthesizer"
            className="mx-auto w-full scroll-mt-16"
          >
            <CollapsibleSection title={t('sections.soundSynthesizer')}>
              <SoundSynthesizer />
            </CollapsibleSection>
          </section>
          <section id="score-editor" className="mx-auto w-full scroll-mt-16">
            <CollapsibleSection title={t('sections.scoreEditor')}>
              <AbcEditor
                abcContent={abcContent}
                onNoteStart={handleNoteStart}
                onNoteEnd={handleNoteEnd}
                onStop={handleStopPlayingNotes}
                onAbcContentChange={setAbcContent}
              />
            </CollapsibleSection>
          </section>
        </div>

        <section id="piano-keyboard" className="scroll-mt-16">
          <Piano
            playingNotes={playingNotes}
            selectedMidiInputId={selectedMidiInputId}
            onNoteInput={isPianoInputEnabled ? handlePianoNoteInput : undefined}
            onMidiControlChange={setMidiControl}
          />
        </section>

        <section id="settings" className="scroll-mt-16">
          <CollapsibleSection
            title={t('sections.settings')}
            bgClassName="bg-app-bg dark:bg-app-bg-dark"
          >
            <SettingsPanel
              midiControl={midiControl}
              selectedMidiInputId={selectedMidiInputId}
              onSelectedMidiInputIdChange={setSelectedMidiInputId}
            />
          </CollapsibleSection>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
