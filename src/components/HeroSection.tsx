import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SERVICES_EN, SERVICES_JA, UI_COPY } from '../i18n/translations';
import { SliderMediaItem, ZoomableImageSlider } from './ZoomableImageSlider';

interface HeroSectionProps {
  onOpenBooking: (defaultService?: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_SLIDE_SOURCES = [
  '/src/assets/images/hero_mineral_living_1794973824082.jpg',
  '/src/assets/images/hero_kirara_office_1795521570127.jpg',
  '/src/assets/images/hero_yonaguni_coral_1795521569741.jpg',
  '/src/assets/images/product_kirara_cream_1794973824722.jpg',
];

export function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const { lang } = useLanguage();
  const t = UI_COPY[lang].hero;

  const heroSlides: SliderMediaItem[] = HERO_SLIDE_SOURCES.map((src, idx) => ({
    src,
    alt: t.slides[idx]?.alt || t.imageAlt,
    fallbackTitle: t.slides[idx]?.fallbackTitle || t.imageFallback,
    caption: t.slides[idx]?.caption || t.imageCaptionLeft,
    meta: t.slides[idx]?.meta || t.imageCaptionRight,
  }));

  return (
    <section id="top" className="bg-white border-b border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 pb-14 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left editorial column */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="lg:col-span-6 flex flex-col justify-between py-2"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-[#2C64AF] mb-4">
                {t.kicker}
              </p>
              <h1 className="text-[clamp(2.15rem,3.6vw,3.35rem)] font-bold tracking-tight text-slate-900 leading-[1.16] mb-6">
                {t.headline}
              </h1>
              <p className="font-serif text-[17px] leading-[1.7] text-slate-600 max-w-xl mb-8">
                {t.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                type="button"
                onClick={() =>
                  onOpenBooking(
                    lang === 'ja'
                      ? SERVICES_JA['tu-van-doanh-nghiep'].title
                      : lang === 'en'
                      ? SERVICES_EN['tu-van-doanh-nghiep'].title
                      : 'Tư vấn Doanh nghiệp Toàn diện'
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2C64AF]"
              >
                <span>{t.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#san-pham"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-[#2C64AF] transition-colors duration-150 whitespace-nowrap shrink-0 py-2"
              >
                <span>{t.secondaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Right multi-image zoomable slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            className="lg:col-span-6 flex flex-col"
          >
            <ZoomableImageSlider
              slides={heroSlides}
              ariaLabel={t.sliderAria}
              zoomInLabel={t.sliderControls.zoomIn}
              zoomOutLabel={t.sliderControls.zoomOut}
              resetZoomLabel={t.sliderControls.resetZoom}
              expandLabel={t.sliderControls.expand}
              closeLabel={t.sliderControls.close}
              prevLabel={t.sliderControls.prev}
              nextLabel={t.sliderControls.next}
              zoomHintText={t.sliderControls.zoomHint}
              frameClassName="min-h-[280px] lg:min-h-[340px]"
            />
          </motion.div>
        </div>

        {/* Full-width 4-column quantitative proof strip below split */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.metrics.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: idx * 0.06, ease: EASE }}
              className="space-y-1.5"
            >
              <div className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-slate-800">{item.label}</div>
              <p className="text-xs leading-relaxed text-slate-500">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
