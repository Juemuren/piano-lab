import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from './components/shared/CollapsibleSection';
import Piano from './components/Piano';
import SoundSynthesizer from './components/SoundSynthesizer';
import AbcEditor from './components/AbcEditor';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
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
      <section
        className="
          relative w-full mx-auto min-h-screen grow pt-20 px-4
          flex flex-col justify-center gap-5
          bg-app-bg dark:bg-app-bg-dark
          text-app-text dark:text-app-text-dark
        "
      >
        <div className="absolute top-3 right-3 sm:right-6">
          <LanguageSwitcher />
        </div>
        <h1 className="text-center text-3xl font-bold">{t('title')}</h1>

        <div
          className="
            flex flex-col items-center gap-5
            xl:flex-row xl:items-start xl:justify-center
          "
        >
          <div className="mx-auto w-full">
            <CollapsibleSection title={t('sections.soundSynthesizer')}>
              <SoundSynthesizer />
            </CollapsibleSection>
          </div>
          <div className="mx-auto w-full">
            <CollapsibleSection title={t('sections.scoreEditor')}>
              <AbcEditor
                onNoteStart={handleNoteStart}
                onNoteEnd={handleNoteEnd}
                onStop={handleStopPlayingNotes}
              />
            </CollapsibleSection>
          </div>
        </div>

        <Piano playingNotes={playingNotes} />
      </section>
      <Footer />
    </SynthEngineProvider>
  );
}

export default App;
