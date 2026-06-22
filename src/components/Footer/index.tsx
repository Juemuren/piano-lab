import { BookOpen, CircuitBoard, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SECTION_IDS } from '../../constants/sections';
import FooterLink from './FooterLink';
import FooterPanel from './FooterPanel';

const articleUrl =
  'https://juemuren.github.io/blog/posts/math/%E9%9F%B3%E4%B9%90%E7%9A%84%E6%95%B0%E5%AD%A6%E5%8E%9F%E7%90%86/';
const repositoryUrl = 'https://github.com/juemuren/piano-lab/';
const abcUrl = 'https://abcnotation.com/learn';

function Footer() {
  const { t } = useTranslation('footer');

  return (
    <footer
      className="p-8 scroll-mt-16 bg-app-mantle dark:bg-app-mantle-dark"
      id={SECTION_IDS.about}
    >
      <div
        className="
          mx-auto w-full max-w-4xl text-left
          grid gap-5 sm:grid-cols-2 sm:items-start
          border-t pt-6 border-app-border dark:border-app-border-dark
        "
      >
        <div className="grid gap-3">
          <FooterPanel icon={<Info size={16} />} title={t('about.title')}>
            {t('about.body')}
          </FooterPanel>
          <FooterPanel
            icon={<CircuitBoard size={16} />}
            title={t('synthesis.title')}
          >
            {t('synthesis.body')}
          </FooterPanel>
          <FooterPanel
            icon={<BookOpen size={16} />}
            title={t('notation.title')}
          >
            {t('notation.body')}
          </FooterPanel>
        </div>

        <div className="grid gap-3">
          <FooterLink href={articleUrl} label={t('links.article')} />
          <FooterLink href={repositoryUrl} label={t('links.repository')} />
          <FooterLink href={abcUrl} label={t('links.abc')} />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
