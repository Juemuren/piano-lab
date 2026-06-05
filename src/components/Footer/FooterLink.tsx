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
        group w-full p-3 flex justify-between text-app-muted dark:text-app-muted-dark
        rounded-lg bg-app-surface-muted dark:bg-app-surface-muted-dark
        transition-colors hover:bg-app-accent-weak dark:hover:bg-app-accent-strong
        hover:text-app-accent-strong dark:hover:text-app-accent-weak
      "
    >
      <span className="text-sm font-medium">{label}</span>
      <ExternalLink size={18} />
    </a>
  );
}

export default FooterLink;
