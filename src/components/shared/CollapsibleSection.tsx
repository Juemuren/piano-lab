import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface CollapsibleSectionProps {
  bgClassName?: string;
  children: ReactNode;
  expanded?: boolean;
  hoverBgClassName?: string;
  icon?: ReactNode;
  title: string;
}

function CollapsibleSection({
  title,
  children,
  icon,
  expanded = false,
  bgClassName = 'bg-app-mantle dark:bg-app-mantle-dark',
  hoverBgClassName = 'hover:bg-app-overlay dark:hover:bg-app-overlay-dark',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full">
      <button
        className={`
          w-full p-3 text-center rounded-lg transition-colors
          ${bgClassName} ${hoverBgClassName}
        `}
        onClick={handleToggle}
        type="button"
      >
        <h2
          className="
            inline-flex items-center justify-center gap-2
            text-xl font-semibold
          "
        >
          {icon}
          {title}
          {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </h2>
      </button>
      <div className={isExpanded ? 'my-4' : 'hidden'}>{children}</div>
    </div>
  );
}

export default CollapsibleSection;
