import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { NAV_ITEMS } from '../../constants/sections';

const MIN_SCROLL_DELTA = 6;
const MIN_SCROLL = 24;

function Header() {
  const { t } = useTranslation('app');
  const lastScrollY = useRef(0);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = NAV_ITEMS.map(({ id, labelKey }) => (
    <a
      key={id}
      href={`#${id}`}
      className="px-2 py-1 hover:underline"
      onClick={() => setIsMenuOpen(false)}
    >
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
      className={`
        sticky top-0 z-10 px-4 p-2
        bg-app-bg dark:bg-app-bg-dark
        border-b border-app-border dark:border-app-border-dark
        transition-transform duration-100
        ${isHidden ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <div className="flex items-center justify-between">
        <details
          className="relative md:hidden"
          open={isMenuOpen}
          onToggle={(e) => setIsMenuOpen(e.currentTarget.open)}
        >
          <summary className="list-none cursor-pointer">
            <Menu size={24} />
          </summary>
          <nav
            className="
              absolute left-0 w-max p-2 flex flex-col
              text-sm text-left
              bg-app-surface-muted dark:bg-app-surface-muted-dark
            "
          >
            {navLinks}
          </nav>
        </details>
        <nav className="hidden items-center truncate text-md md:flex">
          {navLinks}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export default Header;
