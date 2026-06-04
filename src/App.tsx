import { useTranslation } from 'react-i18next';
import CollapsibleSection from './components/shared/CollapsibleSection';
import Piano from './components/Piano';
import SoundSynthesizer from './components/SoundSynthesizer';
import AbcEditor from './components/AbcEditor';
import SettingsPanel from './components/SettingsPanel';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const { t } = useTranslation('app');

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
              <AbcEditor />
            </CollapsibleSection>
          </section>
        </div>

        <section id="piano-keyboard" className="scroll-mt-16">
          <Piano />
        </section>

        <section id="settings" className="mx-auto max-w-4xl scroll-mt-16">
          <CollapsibleSection
            title={t('sections.settings')}
            bgClassName="bg-app-bg dark:bg-app-bg-dark"
          >
            <SettingsPanel />
          </CollapsibleSection>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
