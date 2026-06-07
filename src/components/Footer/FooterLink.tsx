import { ExternalLink } from 'lucide-react';

type FooterLinkProps = {
  href: string;
  label: string;
};

function FooterLink({ href, label }: FooterLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        group w-full p-3 flex justify-between text-app-text dark:text-app-text-dark
        rounded-lg bg-app-surface/50 dark:bg-app-surface-dark/50
        transition-colors hover:bg-app-overlay/50 dark:hover:bg-app-overlay-dark/50
        hover:text-app-subtext dark:hover:text-app-subtext-dark
      "
    >
      <span className="text-sm font-medium">{label}</span>
      <ExternalLink size={18} />
    </a>
  );
}

export default FooterLink;
