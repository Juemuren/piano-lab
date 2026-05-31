import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from './components/shared/CollapsibleSection';
import Piano from './components/Piano';
import SoundSynthesizer from './components/SoundSynthesizer';
import AbcEditor from './components/AbcEditor';
import Header from './components/Header';
import Footer from './components/Footer';
import { SynthEngineProvider } from './contexts/SynthEngineContext';

function App() {
  const { t } = useTranslation('app');
  const [playingNotes, setPlayingNotes] = useState<Set<number>>(new Set());

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

  return (
    <SynthEngineProvider>
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
            className="mx-auto w-full scroll-mt-36"
          >
            <CollapsibleSection title={t('sections.soundSynthesizer')}>
              <SoundSynthesizer />
            </CollapsibleSection>
          </section>
          <section id="score-editor" className="mx-auto w-full scroll-mt-36">
            <CollapsibleSection title={t('sections.scoreEditor')}>
              <AbcEditor
                onNoteStart={handleNoteStart}
                onNoteEnd={handleNoteEnd}
                onStop={handleStopPlayingNotes}
              />
            </CollapsibleSection>
          </section>
        </div>

        <section id="piano-keyboard" className="scroll-mt-36">
          <Piano playingNotes={playingNotes} />
        </section>
      </main>

      <Footer />
    </SynthEngineProvider>
  );
}

export default App;
