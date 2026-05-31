import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

const articleUrl =
  'https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/';
const repositoryUrl = 'https://github.com/Juemuren/web-piano-simulator/';
const abcUrl = 'https://abcnotation.com/learn';

type FooterPanelProps = {
  title: string;
  children: ReactNode;
};

type FooterLinkProps = {
  href: string;
  label: string;
};

function FooterPanel({ title, children }: FooterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className="
        text-sm text-app-muted dark:text-app-muted-dark
        rounded-lg bg-app-surface-muted dark:bg-app-surface-muted-dark
      "
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="
          w-full p-3 rounded-lg flex justify-between
          transition-colors hover:bg-app-accent-weak dark:hover:bg-app-accent-strong
          hover:text-app-accent-strong dark:hover:text-app-accent-weak
        "
        aria-expanded={isExpanded}
      >
        <span className="font-semibold tracking-wide">{title}</span>
        {isExpanded ? (
          <ChevronDown size={18} aria-hidden="true" />
        ) : (
          <ChevronRight size={18} aria-hidden="true" />
        )}
      </button>
      <div className={`${isExpanded ? 'px-4 leading-8' : 'hidden'}`}>
        {children}
      </div>
    </section>
  );
}

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
      <ExternalLink size={18} aria-hidden="true" />
    </a>
  );
}

function Footer() {
  const { t } = useTranslation('piano');

  return (
    <footer className="p-8 bg-app-surface-muted/25 dark:bg-app-surface-muted-dark/75">
      <div
        className="
          mx-auto w-full max-w-4xl text-left
          grid gap-5 sm:grid-cols-2 sm:items-start
          border-t pt-6 border-app-border dark:border-app-border-dark
        "
      >
        <div className="grid gap-3">
          <FooterPanel title={t('footer.tips.title')}>
            {t('footer.tips.body')}
          </FooterPanel>
          <FooterPanel title={t('footer.notation.title')}>
            {t('footer.notation.body')}
          </FooterPanel>
          <FooterPanel title={t('footer.principle.title')}>
            {t('footer.principle.body')}
          </FooterPanel>
        </div>

        <div className="grid gap-3">
          <FooterLink href={articleUrl} label={t('footer.links.article')} />
          <FooterLink
            href={repositoryUrl}
            label={t('footer.links.repository')}
          />
          <FooterLink href={abcUrl} label={t('footer.links.abc')} />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
