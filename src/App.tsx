import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioEngine } from './services/audio/AudioEngine';
import CollapsibleSection from './components/shared/CollapsibleSection';
import Piano from './components/Piano';
import SoundSynthesizer from './components/SoundSynthesizer';
import AbcEditor from './components/AbcEditor';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation('piano');
  const [audioEngine] = useState(() => new AudioEngine());
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
    <>
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
        <h1 className="text-center text-3xl font-bold">{t('app.title')}</h1>

        <div
          className="
            flex flex-col items-center gap-5
            xl:flex-row xl:items-start xl:justify-center
          "
        >
          <div className="mx-auto w-full">
            <CollapsibleSection title={t('sections.soundSynthesizer')}>
              <SoundSynthesizer audioEngine={audioEngine} />
            </CollapsibleSection>
          </div>
          <div className="mx-auto w-full">
            <CollapsibleSection title={t('sections.scoreEditor')}>
              <AbcEditor
                audioEngine={audioEngine}
                onNoteStart={handleNoteStart}
                onNoteEnd={handleNoteEnd}
                onStop={handleStopPlayingNotes}
              />
            </CollapsibleSection>
          </div>
        </div>

        <Piano audioEngine={audioEngine} playingNotes={playingNotes} />
      </section>
      <Footer />
    </>
  );
}

export default App;
