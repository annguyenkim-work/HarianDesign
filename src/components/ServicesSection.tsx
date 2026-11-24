import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { CONSULTING_SERVICES } from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import { SERVICES_EN, SERVICES_JA, UI_COPY } from '../i18n/translations';
import { withBase } from '../utils/assetUrl';
import { SliderMediaItem, ZoomableImageSlider } from './ZoomableImageSlider';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceTitle: string) => void;
  onOpenServiceDetail: (serviceId: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const INTRO_SLIDE_SOURCES = [
  withBase('/src/assets/images/consulting_architecture_1794973825429.jpg'),
  withBase('/src/assets/images/intro_japan_vietnam_team_1795521570584.jpg'),
  withBase('/src/assets/images/intro_danang_studio_1795521570686.jpg'),
  withBase('/src/assets/images/product_stone_bathroom_1794973826284.jpg'),
];

export function ServicesSection({
  onSelectServiceForBooking,
  onOpenServiceDetail,
}: ServicesSectionProps) {
  const [filter, setFilter] = useState<'all' | 'Tư vấn doanh nghiệp' | 'Giải pháp kỹ thuật'>('all');
  const { lang } = useLanguage();
  const t = UI_COPY[lang].services;
  const sliderControls = UI_COPY[lang].hero.sliderControls;

  const introSlides: SliderMediaItem[] = INTRO_SLIDE_SOURCES.map((src, idx) => ({
    src,
    alt: t.introSlides[idx]?.alt || t.aboutImgAlt,
    fallbackTitle: t.introSlides[idx]?.fallbackTitle || t.aboutImgFallback,
    caption: t.introSlides[idx]?.caption || t.aboutHeadline,
    meta: t.introSlides[idx]?.meta || 'Harian Corporation',
  }));

  const visibleServices =
    filter === 'all'
      ? CONSULTING_SERVICES
      : CONSULTING_SERVICES.filter((s) => s.category === filter);

  return (
    <section id="gioi-thieu" className="bg-[#F8FAFC] border-b border-slate-200/80 py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Corporate Profile Intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch pb-16 border-b border-slate-200"
        >
          <div className="lg:col-span-5 flex flex-col">
            <ZoomableImageSlider
              slides={introSlides}
              ariaLabel={t.introSliderAria}
              zoomInLabel={sliderControls.zoomIn}
              zoomOutLabel={sliderControls.zoomOut}
              resetZoomLabel={sliderControls.resetZoom}
              expandLabel={sliderControls.expand}
              closeLabel={sliderControls.close}
              prevLabel={sliderControls.prev}
              nextLabel={sliderControls.next}
              zoomHintText={sliderControls.zoomHint}
              frameClassName="min-h-[250px] lg:min-h-[280px]"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between py-1">
            <div>
              <p className="text-xs font-medium text-[#2C64AF] mb-3">{t.aboutKicker}</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug mb-4">
                {t.aboutHeadline}
              </h2>
              <p className="text-base leading-relaxed text-slate-600 mb-6">{t.aboutDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-sm">
              <div>
                <div className="text-xs text-slate-500 mb-1">{t.legalTitle}</div>
                <div className="font-semibold text-slate-900">{t.legalName}</div>
                <div className="font-mono text-xs text-slate-500 tabular-nums mt-0.5">{t.taxCode}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{t.qualityTitle}</div>
                <div className="font-semibold text-slate-900">{t.qualityName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.qualityDesc}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">{t.hqTitle}</div>
                <div className="font-semibold text-slate-900">{t.hqName}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.hqDesc}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services List */}
        <div id="dich-vu" className="pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-medium text-[#2C64AF] mb-2">{t.servicesKicker}</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {t.servicesHeadline}
              </h2>
            </div>

            <div
              role="group"
              aria-label={t.servicesHeadline}
              className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start"
            >
              {(
                [
                  { id: 'all', label: t.filterAll },
                  { id: 'Tư vấn doanh nghiệp', label: t.filterConsulting },
                  { id: 'Giải pháp kỹ thuật', label: t.filterTechnical },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === tab.id
                      ? 'bg-[#2C64AF] text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200 bg-white rounded-xl overflow-hidden border-x">
            {visibleServices.map((service, idx) => {
              const loc =
                lang === 'ja'
                  ? SERVICES_JA[service.id]
                  : lang === 'en'
                  ? SERVICES_EN[service.id]
                  : undefined;
              const title = loc ? loc.title : service.title;
              const category = loc ? loc.category : service.category;
              const summary = loc ? loc.summary : service.summary;
              const deliverables = loc ? loc.deliverables : service.deliverables;
              const priceLabel = loc ? loc.priceLabel : service.priceLabel;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: idx * 0.04, ease: EASE }}
                  className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-slate-50/70 transition-colors duration-150"
                >
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-mono font-medium text-[#2C64AF] tabular-nums">
                        {service.index}.
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{category}</span>
                    </div>
                    <h3
                      onClick={() => onOpenServiceDetail(service.id)}
                      className="text-lg font-semibold text-slate-900 hover:text-[#2C64AF] transition-colors cursor-pointer mb-2"
                    >
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
                  </div>

                  <div className="lg:col-span-4 space-y-2">
                    <div className="text-xs font-medium text-slate-500 mb-2">
                      {t.deliverablesLabel}
                    </div>
                    {deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-[#2C64AF] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-3 flex flex-col lg:items-end justify-between gap-4 h-full">
                    <div className="lg:text-right">
                      <div className="text-xs text-slate-500">{t.priceLabel}</div>
                      <div className="text-sm font-semibold text-slate-900 font-mono tabular-nums mt-0.5">
                        {priceLabel}
                      </div>
                    </div>
                    <div className="flex flex-wrap lg:justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenServiceDetail(service.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>
                          {lang === 'ja' ? '詳細を見る' : lang === 'en' ? 'Details' : 'Xem chi tiết'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectServiceForBooking(title)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#2C64AF] bg-white border border-slate-200 hover:border-[#2C64AF] hover:bg-[#EFF6FF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{t.bookButton}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
