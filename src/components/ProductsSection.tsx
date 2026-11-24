import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Search } from 'lucide-react';
import {
  KIRARA_COLORS,
  KIRARA_SPEC_ROWS,
  PRODUCT_IMAGES,
} from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import { resolveProductLocale } from '../i18n/productLocale';
import {
  KIRARA_SPEC_ROWS_EN,
  KIRARA_SPEC_ROWS_JA,
  PRODUCT_CATEGORY_EN,
  PRODUCT_CATEGORY_JA,
  UI_COPY,
} from '../i18n/translations';
import { KiraraColorSwatch, ProductCategory, ProductItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductsSectionProps {
  products: ProductItem[];
  onOpenProductDetail: (productId: string) => void;
  onRequestProductQuote: (productName: string) => void;
}

const CATEGORIES: Array<'Tất cả' | ProductCategory> = [
  'Tất cả',
  'Giải pháp về không khí trong nhà',
  'Khoáng chất tốt cho sức khỏe',
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductsSection({
  products,
  onOpenProductDetail,
  onRequestProductQuote,
}: ProductsSectionProps) {
  const { lang } = useLanguage();
  const t = UI_COPY[lang].products;

  const [selectedCategory, setSelectedCategory] = useState<'Tất cả' | ProductCategory>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [specTab, setSpecTab] = useState<'specs' | 'colors'>('specs');
  const [selectedSwatch, setSelectedSwatch] = useState<KiraraColorSwatch>(KIRARA_COLORS[0]);

  function getLocalizedProduct(item: ProductItem) {
    return resolveProductLocale(item, lang);
  }

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const viLoc = resolveProductLocale(item, 'vi');
      const enLoc = resolveProductLocale(item, 'en');
      const jaLoc = resolveProductLocale(item, 'ja');
      const matchesCat = selectedCategory === 'Tất cả' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.sku.toLowerCase().includes(q) ||
        viLoc.name.toLowerCase().includes(q) ||
        viLoc.subtitle.toLowerCase().includes(q) ||
        enLoc.name.toLowerCase().includes(q) ||
        enLoc.subtitle.toLowerCase().includes(q) ||
        jaLoc.name.toLowerCase().includes(q) ||
        jaLoc.subtitle.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.priceVnd - b.priceVnd);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.priceVnd - a.priceVnd);
    }
    if (sortBy === 'name') {
      return [...list].sort((a, b) =>
        getLocalizedProduct(a).name.localeCompare(getLocalizedProduct(b).name, lang)
      );
    }
    return list;
  }, [products, selectedCategory, searchQuery, sortBy, lang]);

  const specRows =
    lang === 'ja' ? KIRARA_SPEC_ROWS_JA : lang === 'en' ? KIRARA_SPEC_ROWS_EN : KIRARA_SPEC_ROWS;

  return (
    <section id="san-pham" className="bg-white border-b border-slate-200/80 py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-[#2C64AF] mb-2">{t.kicker}</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t.headline}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchAria}
                className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2C64AF] w-56"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label={t.sortAria}
              className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#2C64AF] cursor-pointer"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="name">{t.sortName}</option>
              <option value="price-asc">{t.sortAsc}</option>
              <option value="price-desc">{t.sortDesc}</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 mb-8 border-b border-slate-200">
          <div
            role="group"
            aria-label={t.headline}
            className="flex flex-wrap items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200 rounded-lg"
          >
            {CATEGORIES.map((cat) => {
              const label =
                cat === 'Tất cả'
                  ? t.catAll
                  : lang === 'ja'
                  ? PRODUCT_CATEGORY_JA[cat] || cat
                  : lang === 'en'
                  ? PRODUCT_CATEGORY_EN[cat] || cat
                  : cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            {t.showingPrefix} {filteredProducts.length} {t.showingMiddle} {products.length}{' '}
            {t.showingSuffix}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-slate-200 rounded-xl bg-[#F8FAFC]">
            <p className="text-sm font-medium text-slate-700 mb-2">
              {t.emptyMsg} "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Tất cả');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
            >
              {t.resetFilter}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => {
              const p = getLocalizedProduct(product);
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05, ease: EASE }}
                  whileHover={{ y: -3 }}
                  onClick={() => onOpenProductDetail(product.id)}
                  className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors duration-150 cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-slate-50 border-b border-slate-200 overflow-hidden">
                    <ImageWithFallback
                      src={PRODUCT_IMAGES[product.imageKey] || PRODUCT_IMAGES.kirara_cream}
                      alt={p.name}
                      fallbackTitle={p.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 truncate">
                        <span>{p.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{product.sku}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#2C64AF] transition-colors mb-1.5">
                        {p.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {p.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-end justify-between gap-4">
                      <div>
                        <div className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                          {t.fromPrice} {product.priceLabel}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            product.stock > 0 ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                        >
                          {p.stockLabel}
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#2C64AF] group-hover:bg-[#EFF6FF] border border-slate-200 group-hover:border-[#2C64AF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0">
                        <span>{t.detailBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Reference Technical Specifications & 32-Color Palette */}
        <div className="mt-16 pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-medium text-[#2C64AF] mb-2">{t.specsKicker}</p>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {t.specsHeadline}
              </h3>
            </div>

            <div
              role="group"
              aria-label={t.specsHeadline}
              className="inline-flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200 rounded-lg self-start"
            >
              <button
                type="button"
                onClick={() => setSpecTab('specs')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  specTab === 'specs'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabSpecs}
              </button>
              <button
                type="button"
                onClick={() => setSpecTab('colors')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  specTab === 'colors'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabColors}
              </button>
            </div>
          </div>

          {specTab === 'specs' ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-200 text-sm">
                  {specRows.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/70 transition-colors">
                      <th className="py-4 px-5 font-semibold text-slate-800 bg-[#F8FAFC] w-full sm:w-64 block sm:table-cell border-b sm:border-b-0 sm:border-r border-slate-200">
                        {row.label}
                      </th>
                      <td className="py-4 px-5 text-slate-600 leading-relaxed block sm:table-cell">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl p-6 sm:p-8 bg-[#F8FAFC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <p className="text-xs text-slate-500 mb-4">{t.colorGuide}</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {KIRARA_COLORS.map((swatch) => {
                    const isSelected = selectedSwatch.code === swatch.code;
                    return (
                      <button
                        key={swatch.code}
                        type="button"
                        onClick={() => setSelectedSwatch(swatch)}
                        title={`${swatch.code} · ${swatch.name}`}
                        className={`group text-left p-1.5 rounded-lg border transition-all cursor-pointer bg-white ${
                          isSelected
                            ? 'border-[#2C64AF] ring-2 ring-[#2C64AF]/25'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className="w-full aspect-square rounded border border-black/10 mb-1.5"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div className="font-mono text-[11px] font-medium text-slate-700 tabular-nums truncate">
                          {swatch.code}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6">
                <div
                  className="w-full h-36 rounded-lg border border-slate-200 mb-4 transition-colors duration-200"
                  style={{ backgroundColor: selectedSwatch.hex }}
                />
                <div className="text-xs text-slate-500 font-mono tabular-nums mb-1">
                  {t.colorCodePrefix}
                  {selectedSwatch.code}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-2">
                  {selectedSwatch.name}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 mb-5">{t.colorDesc}</p>
                <button
                  type="button"
                  onClick={() =>
                    onRequestProductQuote(
                      `KIRARA Cream — ${selectedSwatch.code} (${selectedSwatch.name})`
                    )
                  }
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  {t.requestSwatchBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
