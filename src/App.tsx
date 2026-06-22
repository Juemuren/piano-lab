import { useTranslation } from 'react-i18next';
import AbcEditor from './components/AbcEditor';
import Footer from './components/Footer';
import Header from './components/Header';
import Piano from './components/Piano';
import SettingsPanel from './components/SettingsPanel';
import SoundSynthesizer from './components/SoundSynthesizer';
import CollapsibleSection from './components/shared/CollapsibleSection';
import SectionIcon from './components/shared/SectionIcon';
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
            className="mx-auto w-full min-w-0 scroll-mt-16 xl:flex-1"
            id={SECTION_IDS.soundSynthesizer}
          >
            <CollapsibleSection
              icon={
                <SectionIcon
                  sectionId={SECTION_IDS.soundSynthesizer}
                  size={24}
                />
              }
              title={t('sections.soundSynthesizer')}
            >
              <SoundSynthesizer />
            </CollapsibleSection>
          </section>
          <section
            className="mx-auto w-full min-w-0 scroll-mt-16 xl:flex-1"
            id={SECTION_IDS.scoreEditor}
          >
            <CollapsibleSection
              icon={
                <SectionIcon sectionId={SECTION_IDS.scoreEditor} size={24} />
              }
              title={t('sections.scoreEditor')}
            >
              <AbcEditor />
            </CollapsibleSection>
          </section>
        </div>

        <section className="scroll-mt-16" id={SECTION_IDS.pianoKeyboard}>
          <Piano />
        </section>

        <section
          className="mx-auto w-full sm:w-lg lg:w-2xl xl:w-4xl scroll-mt-16"
          id={SECTION_IDS.settings}
        >
          <CollapsibleSection
            bgClassName="bg-app-base dark:bg-app-base-dark"
            icon={<SectionIcon sectionId={SECTION_IDS.settings} size={24} />}
            title={t('sections.settings')}
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
