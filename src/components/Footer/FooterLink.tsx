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
      className="group flex w-full justify-between rounded-lg bg-app-surface/50 p-3 text-app-text transition-colors hover:bg-app-overlay/50 hover:text-app-subtext dark:bg-app-surface-dark/50 dark:text-app-text-dark dark:hover:bg-app-overlay-dark/50 dark:hover:text-app-subtext-dark"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span className="inline-flex items-center gap-2 font-medium text-sm tracking-wide">
        {icon}
        {label}
      </span>
      <ExternalLink size={18} />
    </a>
  );
}

export default FooterLink;
