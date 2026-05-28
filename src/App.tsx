import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioEngine } from './services/audio/AudioEngine';
import Piano from './components/Piano';
import TimbreAdjuster from './components/Timbre';
import TransferFunctionModifier from './components/TransferFunction';
import ABCEditor from './components/ABCEditor';
import HarmonicSynthesizer from './components/Harmonic';
import CollapsibleSection from './components/CollapsibleSection';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation('piano');
  const [audioEngine] = useState(() => new AudioEngine());
  const [harmonicCount, setHarmonicCount] = useState(() =>
    audioEngine.getHarmonicCount(),
  );
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
          <div className="w-full max-w-4xl xl:max-w-md">
            <CollapsibleSection title={t('sections.harmonicSynthesizer')}>
              <HarmonicSynthesizer
                audioEngine={audioEngine}
                harmonicCount={harmonicCount}
                onHarmonicCountChange={setHarmonicCount}
              />
            </CollapsibleSection>
          </div>
          <div className="w-full max-w-4xl xl:max-w-md">
            <CollapsibleSection title={t('sections.timbreAdjuster')}>
              <TimbreAdjuster
                audioEngine={audioEngine}
                harmonicCount={harmonicCount}
              />
            </CollapsibleSection>
          </div>
          <div className="w-full max-w-4xl xl:max-w-md">
            <CollapsibleSection title={t('sections.transferFunctionModifier')}>
              <TransferFunctionModifier
                audioEngine={audioEngine}
                harmonicCount={harmonicCount}
              />
            </CollapsibleSection>
          </div>
        </div>
        <div className="mx-auto w-full max-w-4xl">
          <CollapsibleSection title={t('sections.scoreEditor')}>
            <ABCEditor
              audioEngine={audioEngine}
              onNoteStart={handleNoteStart}
              onNoteEnd={handleNoteEnd}
              onStop={handleStopPlayingNotes}
            />
          </CollapsibleSection>
        </div>

        <Piano audioEngine={audioEngine} playingNotes={playingNotes} />
      </section>
      <Footer />
    </>
  );
}

export default App;
