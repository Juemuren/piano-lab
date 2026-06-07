import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type CollapsibleSectionProps = {
  title: string;
  children: ReactNode;
  expanded?: boolean;
  bgClassName?: string;
  hoverBgClassName?: string;
};

function CollapsibleSection({
  title,
  children,
  expanded = false,
  bgClassName = 'bg-app-surface dark:bg-app-surface-dark',
  hoverBgClassName = 'hover:bg-app-mantle dark:hover:bg-app-mantle-dark',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full p-3 text-center rounded-lg transition-colors
          ${bgClassName} ${hoverBgClassName}
        `}
      >
        <h2
          className="
            inline-flex items-center justify-center gap-2
            text-xl font-semibold
          "
        >
          {title}
          {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
        </h2>
      </button>
      <div className={isExpanded ? 'my-4' : 'hidden'}>{children}</div>
    </div>
  );
}

export default CollapsibleSection;
