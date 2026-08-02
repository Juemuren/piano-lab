import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../../constants/sections';
import SectionIcon from '../shared/SectionIcon';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const MIN_SCROLL_DELTA = 6;
const MIN_SCROLL = 24;

function Header() {
  const { t } = useTranslation('app');
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = NAV_ITEMS.map(({ id, labelKey }) => (
    <a
      className="inline-flex items-center gap-1 px-2 py-1 hover:underline"
      href={`#${id}`}
      key={id}
      onClick={() => setIsMenuOpen(false)}
    >
      <SectionIcon sectionId={id} size={16} />
      {t(labelKey)}
    </a>
  ));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY.current;

      if (scrollY < MIN_SCROLL) {
        setIsHidden(false);
      } else if (scrollDelta > MIN_SCROLL_DELTA) {
        setIsHidden(true);
      } else if (scrollDelta < -MIN_SCROLL_DELTA) {
        setIsHidden(false);
      }

      lastScrollY.current = scrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 border-app-border border-b bg-app-base p-2 px-4 transition-transform duration-100 dark:border-app-border-dark dark:bg-app-base-dark ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex items-center justify-between">
        <details
          className="relative md:hidden"
          onToggle={(e) => setIsMenuOpen(e.currentTarget.open)}
          open={isMenuOpen}
        >
          <summary className="cursor-pointer list-none">
            <Menu size={24} />
          </summary>
          <nav className="absolute left-0 flex w-max flex-col bg-app-surface p-2 text-left text-sm dark:bg-app-surface-dark">
            {navLinks}
          </nav>
        </details>
        <nav className="hidden items-center truncate text-md md:flex">
          {navLinks}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
