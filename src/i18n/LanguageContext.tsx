import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Language = 'vi' | 'en' | 'ja';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'harian_lang';

const DOC_TITLES: Record<Language, string> = {
  vi: 'Harian Vietnam — Giải pháp Không khí Kirara & Tư vấn Doanh nghiệp',
  en: 'Harian Vietnam — Kirara Air Solutions & Corporate Consulting',
  ja: 'Harian Vietnam — 自然鉱物塗材キララ & 日越企業コンサルティング',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'vi';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ja' || saved === 'en' || saved === 'vi') return saved;
    return 'vi';
  });

  function setLang(next: Language) {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang;
    if (!document.title) {
      document.title = DOC_TITLES[lang];
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
