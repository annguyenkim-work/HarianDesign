import { Globe } from 'lucide-react';
import { Language, useLanguage } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  compact?: boolean;
}

const OPTIONS: Array<{ code: Language; label: string; fullName: string }> = [
  { code: 'vi', label: 'VI', fullName: 'Tiếng Việt' },
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'ja', label: 'JA', fullName: '日本語' },
];

const ARIA_LABELS: Record<Language, string> = {
  vi: 'Chuyển đổi ngôn ngữ',
  en: 'Switch language',
  ja: '言語切替',
};

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label={ARIA_LABELS[lang]}
      className="inline-flex items-center gap-0.5 p-0.5 bg-[#F8FAFC] border border-slate-200 rounded-lg shrink-0"
    >
      {!compact && (
        <span className="pl-2 pr-1 text-slate-400 flex items-center" aria-hidden="true">
          <Globe className="w-3.5 h-3.5" />
        </span>
      )}
      {OPTIONS.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLang(opt.code)}
            aria-pressed={active}
            title={opt.fullName}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF] ${
              active
                ? 'bg-[#2C64AF] text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {compact ? `${opt.label} · ${opt.fullName}` : opt.label}
          </button>
        );
      })}
    </div>
  );
}
