import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
      rounded-lg
      bg-app-bg/50 dark:bg-app-bg-dark/50
      border border-app-border dark:border-app-border-dark
    "
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="
          w-full flex items-center justify-between px-4 py-3
          rounded-lg text-left
          transition-colors hover:bg-app-accent-weak dark:hover:bg-app-accent-strong
        "
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-semibold tracking-wide text-app-muted dark:text-app-muted-dark">
          {title}
        </span>
        <span className="shrink-0 text-sm text-app-muted dark:text-app-muted-dark">
          {isExpanded ? '▼' : '▶'}
        </span>
      </button>
      <div
        className={`
          text-sm text-app-muted dark:text-app-muted-dark
          ${isExpanded ? 'p-4 leading-8 text-base' : 'hidden'}
        `}
      >
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
        group w-full flex items-center justify-between px-4 py-3
        text-left text-app-muted dark:text-app-muted-dark
        rounded-lg bg-app-bg/50 dark:bg-app-bg-dark/50
        border border-app-border dark:border-app-border-dark
        transition-colors
        hover:text-app-accent-strong dark:hover:text-app-accent-weak
        hover:bg-app-accent-weak dark:hover:bg-app-accent-strong
        hover:border-app-accent dark:hover:border-app-accent
      "
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className="
          flex h-4 w-4 shrink-0 items-center justify-center
          rounded-full border border-app-border dark:border-app-border-dark
          text-xs text-app-muted dark:text-app-muted-dark
          transition-colors group-hover:text-app-accent dark:group-hover:text-app-accent-weak
          group-hover:border-app-accent dark:group-hover:border-app-accent 
        "
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  );
}

function Footer() {
  const { t } = useTranslation('piano');

  return (
    <footer className="px-6 py-8 bg-app-muted/75 dark:bg-app-muted-dark/25">
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

        <div className="grid gap-3 sm:justify-items-end">
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
