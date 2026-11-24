import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, Phone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const EASE = [0.16, 1, 0.3, 1] as const;

export function FloatingActionDock() {
  const { lang } = useLanguage();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const labels = {
    zalo: lang === 'ja' ? 'Zaloで相談' : lang === 'en' ? 'Chat on Zalo' : 'Liên hệ Zalo',
    facebook: lang === 'ja' ? 'Facebookページ' : lang === 'en' ? 'Facebook Page' : 'Liên hệ Facebook',
    phone: lang === 'ja' ? '電話: 0982 113 488' : lang === 'en' ? 'Call: 0982 113 488' : 'Gọi 0982 113 488',
    top: lang === 'ja' ? 'トップへ戻る' : lang === 'en' ? 'Back to top' : 'Lên đầu trang',
  };

  return (
    <div
      aria-label={
        lang === 'ja'
          ? 'クイック連絡・トップへ戻る'
          : lang === 'en'
          ? 'Quick contact and scroll to top'
          : 'Liên hệ nhanh và cuộn lên đầu trang'
      }
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5"
    >
      {/* 3 Quick Contact Buttons: Zalo, Facebook, Phone */}
      <motion.a
        href="https://zalo.me/0982113488"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.zalo}
        title={labels.zalo}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-[#0068FF] hover:shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF]"
      >
        <span className="hidden md:block pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-sm">
          {labels.zalo}
        </span>
        {/* Clean Zalo monogram badge inside icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="17" rx="5" fill="#0068FF" />
          <path d="M6.5 19.5L9 17.5H6.5V19.5Z" fill="#0068FF" />
          <text
            x="12"
            y="14.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7.2"
            fontWeight="700"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Zalo
          </text>
        </svg>
      </motion.a>

      <motion.a
        href="https://www.facebook.com/HARIANCorporation"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.facebook}
        title={labels.facebook}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-[#1877F2] hover:shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]"
      >
        <span className="hidden md:block pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-sm">
          {labels.facebook}
        </span>
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#1877F2" />
          <path
            d="M15.1 12.7l.4-2.5h-2.4V8.6c0-.7.3-1.3 1.4-1.3h1.1V5.1s-1-.2-1.9-.2c-2 0-3.2 1.2-3.2 3.3v1.9H8.3v2.5h2.2v6.2c.5.1 1 .1 1.5.1s1 0 1.5-.1v-6.2h1.6z"
            fill="#FFFFFF"
          />
        </svg>
      </motion.a>

      <motion.a
        href="tel:0982113488"
        aria-label={labels.phone}
        title={labels.phone}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#2C64AF] text-white border border-[#2C64AF] shadow-sm hover:bg-[#1E4B8A] hover:shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2C64AF]"
      >
        <span className="hidden md:block pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-sm">
          {labels.phone}
        </span>
        <Phone className="w-4 h-4" strokeWidth={2.2} />
      </motion.a>

      {/* Smooth Animated Floating Back-to-Top Button */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="back-to-top"
            type="button"
            onClick={scrollToTop}
            aria-label={labels.top}
            title={labels.top}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="group relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 text-white border border-slate-900 shadow-sm hover:bg-slate-800 hover:shadow-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            <span className="hidden md:block pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-150 absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-sm">
              {labels.top}
            </span>
            <ArrowUp className="w-4 h-4" strokeWidth={2.2} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
