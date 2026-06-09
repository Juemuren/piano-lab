import { ScrollText, SlidersHorizontal, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AbcEditor from './components/AbcEditor';
import Footer from './components/Footer';
import Header from './components/Header';
import Piano from './components/Piano';
import SettingsPanel from './components/SettingsPanel';
import SoundSynthesizer from './components/SoundSynthesizer';
import CollapsibleSection from './components/shared/CollapsibleSection';
import { SECTION_IDS } from './constants/sections';

function App() {
  const { t } = useTranslation('app');

  return (
    <>
      <Header />

      <main
        className="
          w-full min-h-screen mx-auto p-5
          flex flex-col grow justify-center gap-5
          bg-app-base dark:bg-app-base-dark
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
            id={SECTION_IDS.soundSynthesizer}
            className="mx-auto w-full scroll-mt-16"
          >
            <CollapsibleSection
              title={t('sections.soundSynthesizer')}
              icon={<Waves size={24} />}
            >
              <SoundSynthesizer />
            </CollapsibleSection>
          </section>
          <section
            id={SECTION_IDS.scoreEditor}
            className="mx-auto w-full scroll-mt-16"
          >
            <CollapsibleSection
              title={t('sections.scoreEditor')}
              icon={<ScrollText size={24} />}
            >
              <AbcEditor />
            </CollapsibleSection>
          </section>
        </div>

        <section id={SECTION_IDS.pianoKeyboard} className="scroll-mt-16">
          <Piano />
        </section>

        <section
          id={SECTION_IDS.settings}
          className="mx-auto w-full sm:w-lg lg:w-2xl xl:w-4xl scroll-mt-16"
        >
          <CollapsibleSection
            title={t('sections.settings')}
            icon={<SlidersHorizontal size={24} />}
            bgClassName="bg-app-base dark:bg-app-base-dark"
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
