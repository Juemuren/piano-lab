import type { LucideIcon } from 'lucide-react';
import { Info, Piano, ScrollText, Settings, Waves } from 'lucide-react';
import type { SectionId } from '../../constants/sections';

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  'sound-synthesizer': Waves,
  'score-editor': ScrollText,
  'piano-keyboard': Piano,
  settings: Settings,
  about: Info,
};

interface SectionIconProps {
  sectionId: SectionId;
  size: number;
}

function SectionIcon({ sectionId, size }: SectionIconProps) {
  const Icon = SECTION_ICONS[sectionId];

  return <Icon size={size} />;
}

export default SectionIcon;
