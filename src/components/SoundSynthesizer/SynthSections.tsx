import {
  ChartColumnDecreasing,
  ChartLine,
  ChartSpline,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from '../shared/CollapsibleSection';
import Analysis from './Analysis';
import Effect from './Effect';
import Envelope from './Envelope';
import Spectrum from './Spectrum';

const sectionClassName = 'bg-app-surface/50 dark:bg-app-surface-dark/50';

function SynthSections() {
  const { t } = useTranslation('synth');

  return (
    <>
      <CollapsibleSection
        bgClassName={sectionClassName}
        expanded
        icon={<ChartColumnDecreasing size={20} />}
        title={t('sections.spectrum')}
      >
        <Spectrum />
      </CollapsibleSection>

      <CollapsibleSection
        bgClassName={sectionClassName}
        expanded
        icon={<ChartSpline size={20} />}
        title={t('sections.envelope')}
      >
        <Envelope />
      </CollapsibleSection>

      <CollapsibleSection
        bgClassName={sectionClassName}
        expanded
        icon={<Sparkles size={20} />}
        title={t('sections.effect')}
      >
        <Effect />
      </CollapsibleSection>

      <CollapsibleSection
        bgClassName={sectionClassName}
        expanded
        icon={<ChartLine size={20} />}
        title={t('sections.analysis')}
      >
        <Analysis />
      </CollapsibleSection>
    </>
  );
}

export default SynthSections;
