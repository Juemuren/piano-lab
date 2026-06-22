import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

interface FooterLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

function FooterLink({ href, icon, label }: FooterLinkProps) {
  return (
    <a
      className="
        group w-full p-3 flex justify-between text-app-text dark:text-app-text-dark
        rounded-lg bg-app-surface/50 dark:bg-app-surface-dark/50
        transition-colors hover:bg-app-overlay/50 dark:hover:bg-app-overlay-dark/50
        hover:text-app-subtext dark:hover:text-app-subtext-dark
      "
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide">
        {icon}
        {label}
      </span>
      <ExternalLink size={18} />
    </a>
  );
}

export default FooterLink;
