import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ARTICLE_IMAGES } from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import { NEWS_ARTICLES_EN, NEWS_ARTICLES_JA, NEWS_CATEGORY_LABELS } from '../i18n/translations';
import { NewsArticle } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface NewsDetailPageProps {
  article: NewsArticle;
  allArticles: NewsArticle[];
  onBackHome: () => void;
  onSelectArticle: (id: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function NewsDetailPage({
  article,
  allArticles,
  onBackHome,
  onSelectArticle,
}: NewsDetailPageProps) {
  const { lang } = useLanguage();
  const loc =
    lang === 'ja'
      ? NEWS_ARTICLES_JA[article.id]
      : lang === 'en'
      ? NEWS_ARTICLES_EN[article.id]
      : undefined;

  const title = loc ? loc.title : article.title;
  const summary = loc ? loc.summary : article.summary;
  const content = loc ? loc.content : article.content;
  const author = loc ? loc.author : article.author;
  const categoryLabel = NEWS_CATEGORY_LABELS[article.category]?.[lang] || article.category;

  const related = allArticles
    .filter((a) => a.id !== article.id && a.status === 'published')
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="bg-white min-h-[80vh]"
    >
      <article className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#2C64AF] transition-colors cursor-pointer"
            >
              {lang === 'ja' ? 'ホーム' : lang === 'en' ? 'Home' : 'Trang chủ'}
            </button>
            <span aria-hidden="true">/</span>
            <span>{lang === 'ja' ? 'ニュース' : lang === 'en' ? 'News' : 'Tin tức'}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium line-clamp-1 max-w-[240px]">{title}</span>
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2C64AF] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {lang === 'ja'
                ? '一覧へ戻る'
                : lang === 'en'
                ? 'Back to Home'
                : 'Quay lại trang chủ'}
            </span>
          </button>
        </div>

        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-[#2C64AF]">{categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{author}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
            {title}
          </h1>
          <p className="font-serif text-lg italic text-slate-600 leading-relaxed bg-[#F8FAFC] p-5 rounded-xl border border-slate-200">
            {summary}
          </p>
        </header>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 mb-10">
          <ImageWithFallback
            src={ARTICLE_IMAGES[article.imageKey] || ARTICLE_IMAGES.consulting}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-[70ch] space-y-5 text-base leading-8 text-slate-700 whitespace-pre-line">
          {content}
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {lang === 'ja'
                ? 'その他の最新ニュース'
                : lang === 'en'
                ? 'Related News & Updates'
                : 'Tin tức liên quan'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((rel) => {
                const relLoc =
                  lang === 'ja'
                    ? NEWS_ARTICLES_JA[rel.id]
                    : lang === 'en'
                    ? NEWS_ARTICLES_EN[rel.id]
                    : undefined;
                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel.id)}
                    className="group p-5 rounded-xl border border-slate-200 hover:border-[#2C64AF] bg-white transition-colors cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs text-slate-500 font-mono tabular-nums mb-1.5">
                        {NEWS_CATEGORY_LABELS[rel.category]?.[lang] || rel.category} ·{' '}
                        {rel.publishedAt}
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-[#2C64AF] transition-colors">
                        {relLoc ? relLoc.title : rel.title}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF]">
                      <span>
                        {lang === 'ja'
                          ? '記事を読む'
                          : lang === 'en'
                          ? 'Read article'
                          : 'Đọc bài viết'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </motion.div>
  );
}
