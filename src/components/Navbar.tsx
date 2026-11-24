import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { UI_COPY } from '../i18n/translations';
import { AppRoute } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigateHomeSection: (sectionId?: string) => void;
  onNavigateAdmin: () => void;
  onOpenBooking: () => void;
}

export function Navbar({
  currentRoute,
  onNavigateHomeSection,
  onNavigateAdmin,
  onOpenBooking,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang } = useLanguage();
  const t = UI_COPY[lang].nav;

  const adminLabel = lang === 'ja' ? '管理画面' : lang === 'en' ? 'Admin' : 'Quản trị';

  const navItems: Array<{ label: string; sectionId?: string; isAdmin?: boolean }> = [
    { label: t.services, sectionId: 'dich-vu' },
    { label: t.products, sectionId: 'san-pham' },
    { label: t.news, sectionId: 'tin-tuc' },
    { label: t.careers, sectionId: 'tuyen-dung' },
    { label: adminLabel, isAdmin: true },
  ];

  function handleItemClick(item: (typeof navItems)[number]) {
    setMobileOpen(false);
    if (item.isAdmin) {
      onNavigateAdmin();
    } else {
      onNavigateHomeSection(item.sectionId);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element clean wordmark */}
        <button
          type="button"
          onClick={() => onNavigateHomeSection()}
          className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF] rounded-sm"
        >
          Harian
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label={t.navAria}
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActiveAdmin = item.isAdmin && currentRoute.name === 'admin';
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors duration-150 border-b cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF] rounded-sm ${
                  isActiveAdmin
                    ? 'text-[#2C64AF] border-[#2C64AF] font-semibold'
                    : 'text-slate-600 border-transparent hover:text-[#2C64AF] hover:border-[#2C64AF]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2C64AF]"
          >
            {t.bookCta}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.closeMenu : t.openMenu}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <LanguageSwitcher compact />
          </div>
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleItemClick(item)}
              className="w-full text-left block py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#2C64AF] rounded-lg cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenBooking();
            }}
            className="w-full mt-2 py-2.5 px-4 text-sm font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer"
          >
            {t.bookCta}
          </button>
        </div>
      )}
    </header>
  );
}
