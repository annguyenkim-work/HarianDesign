import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FileEdit, Search } from 'lucide-react';
import { ARTICLE_IMAGES } from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import {
  NEWS_ARTICLES_EN,
  NEWS_ARTICLES_JA,
  NEWS_CATEGORY_LABELS,
  UI_COPY,
} from '../i18n/translations';
import { NewsArticle, NewsCategory } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface NewsSectionProps {
  articles: NewsArticle[];
  onOpenNewsDetail: (articleId: string) => void;
  onOpenAdminNews: () => void;
}

const NEWS_CATEGORIES: Array<'Tất cả' | NewsCategory> = [
  'Tất cả',
  'Sự kiện',
  'Hợp tác quốc tế',
  'Thị trường',
  'Công nghệ Kirara',
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function NewsSection({
  articles,
  onOpenNewsDetail,
  onOpenAdminNews,
}: NewsSectionProps) {
  const { lang } = useLanguage();
  const t = UI_COPY[lang].news;

  const [categoryFilter, setCategoryFilter] = useState<'Tất cả' | NewsCategory>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  function getLocalizedArticle(a: NewsArticle) {
    const loc =
      lang === 'ja'
        ? NEWS_ARTICLES_JA[a.id]
        : lang === 'en'
        ? NEWS_ARTICLES_EN[a.id]
        : undefined;
    return {
      title: loc ? loc.title : a.title,
      summary: loc ? loc.summary : a.summary,
      author: loc ? loc.author : a.author,
      categoryLabel: NEWS_CATEGORY_LABELS[a.category]?.[lang] || a.category,
    };
  }

  const publishedArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((a) => {
      if (a.status !== 'published') return false;
      const catOk = categoryFilter === 'Tất cả' || a.category === categoryFilter;
      const loc = getLocalizedArticle(a);
      const queryOk =
        !q ||
        loc.title.toLowerCase().includes(q) ||
        loc.summary.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q);
      return catOk && queryOk;
    });
  }, [articles, categoryFilter, searchQuery, lang]);

  return (
    <section id="tin-tuc" className="bg-[#F8FAFC] border-b border-slate-200/80 py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-[#2C64AF] mb-2">{t.kicker}</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t.headline}
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenAdminNews}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#2C64AF] bg-white border border-slate-200 hover:border-[#2C64AF] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{t.tabCms}</span>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start">
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {NEWS_CATEGORY_LABELS[cat]?.[lang] || cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2C64AF] w-full sm:w-64"
            />
          </div>
        </div>

        {publishedArticles.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-600">{t.emptyFeed}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedArticles.map((article, idx) => {
              const loc = getLocalizedArticle(article);
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05, ease: EASE }}
                  whileHover={{ y: -3 }}
                  onClick={() => onOpenNewsDetail(article.id)}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors cursor-pointer flex flex-col"
                >
                  <div className="aspect-[16/9] bg-slate-100 border-b border-slate-200 overflow-hidden">
                    <ImageWithFallback
                      src={ARTICLE_IMAGES[article.imageKey] || ARTICLE_IMAGES.consulting}
                      alt={loc.title}
                      fallbackTitle={loc.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="font-medium text-[#2C64AF]">{loc.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{article.publishedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{loc.author}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#2C64AF] transition-colors leading-snug mb-2">
                        {loc.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {loc.summary}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF]">
                      <span>{t.readMore.replace('→', '').trim()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
