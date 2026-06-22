import type { LucideIcon } from 'lucide-react';
import { Info, Piano, ScrollText, Settings, Waves } from 'lucide-react';
import type { SectionId } from '../../constants/sections';

const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  about: Info,
  'piano-keyboard': Piano,
  'score-editor': ScrollText,
  settings: Settings,
  'sound-synthesizer': Waves,
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
