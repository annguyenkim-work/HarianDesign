import { PRODUCT_IMAGES, ARTICLE_IMAGES } from '../data/catalog';
import { INITIAL_SEO_SETTINGS } from '../data/seoDefaults';
import { resolveProductLocale } from '../i18n/productLocale';
import {
  JOBS_EN,
  JOBS_JA,
  NEWS_ARTICLES_EN,
  NEWS_ARTICLES_JA,
  SERVICES_EN,
  SERVICES_JA,
} from '../i18n/translations';
import {
  AppLanguage,
  AppRoute,
  ConsultingService,
  JobPosting,
  NewsArticle,
  ProductItem,
  ProductSubDetail,
  SeoSectionConfig,
  SeoSectionKey,
} from '../types';

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(payload: Record<string, unknown>) {
  if (typeof document === 'undefined') return;
  let script = document.getElementById('harian-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'harian-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function resolveSectionFromRoute(
  route: AppRoute,
  activeHomeSection: SeoSectionKey
): SeoSectionKey {
  if (route.name === 'product-detail' || route.name === 'product-subdetail') {
    return 'products';
  }
  if (route.name === 'service-detail') {
    return 'services';
  }
  if (route.name === 'news-detail') {
    return 'news';
  }
  if (route.name === 'job-detail') {
    return 'careers';
  }
  if (route.name === 'admin') {
    if (route.tab === 'products' || route.tab === 'sales') return 'products';
    if (route.tab === 'news') return 'news';
    if (route.tab === 'recruitment') return 'careers';
    if (route.tab === 'contacts') return 'contact';
    return 'home';
  }
  return activeHomeSection;
}

export function applyDocumentSeo(params: {
  route: AppRoute;
  activeHomeSection: SeoSectionKey;
  seoSettings: SeoSectionConfig[];
  lang: AppLanguage;
  activeProduct?: ProductItem | null;
  activeSubDetail?: ProductSubDetail | null;
  activeService?: ConsultingService | null;
  activeNews?: NewsArticle | null;
  activeJob?: JobPosting | null;
}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const {
    route,
    activeHomeSection,
    seoSettings,
    lang,
    activeProduct,
    activeSubDetail,
    activeService,
    activeNews,
    activeJob,
  } = params;

  const sectionKey = resolveSectionFromRoute(route, activeHomeSection);
  const config =
    seoSettings.find((s) => s.section === sectionKey) ||
    INITIAL_SEO_SETTINGS.find((s) => s.section === sectionKey) ||
    INITIAL_SEO_SETTINGS[0];

  const langTags = config[lang] || config.vi;
  let title = langTags.title;
  let metaDescription = langTags.metaDescription;
  let ogTitle = langTags.ogTitle || title;
  let ogDescription = langTags.ogDescription || metaDescription;
  let ogType: 'website' | 'article' | 'product' = config.ogType;
  let ogImage = config.ogImage;
  let robots = config.robots || 'index, follow';

  const origin = window.location.origin;
  let canonicalUrl = `${origin}${config.canonicalPath.startsWith('/') ? config.canonicalPath : `/${config.canonicalPath}`}`;

  let jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.ogSiteName || 'Harian Corporation Vietnam',
    url: canonicalUrl,
    description: metaDescription,
  };

  if (route.name === 'product-detail' && activeProduct) {
    const loc = resolveProductLocale(activeProduct, lang);
    title = `${loc.name} | ${config.ogSiteName}`;
    metaDescription = loc.subtitle || loc.summary.slice(0, 155);
    ogTitle = title;
    ogDescription = metaDescription;
    ogType = 'product';
    ogImage = PRODUCT_IMAGES[activeProduct.imageKey] || ogImage;
    canonicalUrl = `${origin}/#/san-pham/${activeProduct.id}`;
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: loc.name,
      sku: activeProduct.sku,
      description: metaDescription,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'VND',
        price: activeProduct.priceVnd,
        availability:
          activeProduct.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/PreOrder',
      },
    };
  } else if (route.name === 'product-subdetail' && activeProduct && activeSubDetail) {
    const loc = resolveProductLocale(activeProduct, lang);
    const subLoc = activeSubDetail[lang] || activeSubDetail.vi;
    title = `${subLoc.pageTitle} — ${loc.name} | Harian`;
    metaDescription = subLoc.lead.slice(0, 158);
    ogTitle = title;
    ogDescription = metaDescription;
    ogType = 'product';
    ogImage = ARTICLE_IMAGES[activeSubDetail.imageKey] || ogImage;
    canonicalUrl = `${origin}/#/san-pham/${activeProduct.id}/${activeSubDetail.slug}`;
  } else if (route.name === 'service-detail' && activeService) {
    const svLoc =
      lang === 'ja'
        ? SERVICES_JA[activeService.id]
        : lang === 'en'
        ? SERVICES_EN[activeService.id]
        : undefined;
    const svTitle = svLoc ? svLoc.title : activeService.title;
    const svSummary = svLoc ? svLoc.summary : activeService.summary;
    title = `${svTitle} | ${config.ogSiteName}`;
    metaDescription = svSummary.slice(0, 158);
    ogTitle = title;
    ogDescription = metaDescription;
    canonicalUrl = `${origin}/#/dich-vu/${activeService.id}`;
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: svTitle,
      provider: {
        '@type': 'Organization',
        name: config.ogSiteName,
      },
      description: metaDescription,
    };
  } else if (route.name === 'news-detail' && activeNews) {
    const nLoc =
      lang === 'ja'
        ? NEWS_ARTICLES_JA[activeNews.id]
        : lang === 'en'
        ? NEWS_ARTICLES_EN[activeNews.id]
        : undefined;
    const nTitle = nLoc ? nLoc.title : activeNews.title;
    const nSummary = nLoc ? nLoc.summary : activeNews.summary;
    title = `${nTitle} | Harian`;
    metaDescription = nSummary.slice(0, 158);
    ogTitle = title;
    ogDescription = metaDescription;
    ogType = 'article';
    ogImage = ARTICLE_IMAGES[activeNews.imageKey] || ogImage;
    canonicalUrl = `${origin}/#/tin-tuc/${activeNews.id}`;
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: nTitle,
      datePublished: activeNews.publishedAt,
      description: metaDescription,
    };
  } else if (route.name === 'job-detail' && activeJob) {
    const jLoc =
      lang === 'ja'
        ? JOBS_JA[activeJob.id]
        : lang === 'en'
        ? JOBS_EN[activeJob.id]
        : undefined;
    const jTitle = jLoc ? jLoc.title : activeJob.title;
    const jSummary = jLoc ? jLoc.summary : activeJob.summary;
    title = `${jTitle} | ${config.ogSiteName}`;
    metaDescription = jSummary.slice(0, 158);
    ogTitle = title;
    ogDescription = metaDescription;
    canonicalUrl = `${origin}/#/tuyen-dung/${activeJob.id}`;
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: jTitle,
      description: metaDescription,
      validThrough: activeJob.deadline,
    };
  } else if (route.name === 'admin') {
    const adminPrefix =
      lang === 'ja'
        ? '管理ポータル'
        : lang === 'en'
        ? 'Admin Portal'
        : 'Trang quản trị';
    title = `${adminPrefix} — ${config.ogSiteName}`;
    robots = 'noindex, nofollow';
  }

  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${origin}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  const ogLocale =
    lang === 'ja' ? 'ja_JP' : lang === 'en' ? 'en_US' : 'vi_VN';

  document.title = title;
  upsertMetaTag('name', 'description', metaDescription);
  upsertMetaTag('name', 'robots', robots);
  if (config.keywords) {
    upsertMetaTag('name', 'keywords', config.keywords);
  }
  upsertMetaTag('property', 'og:type', ogType);
  upsertMetaTag('property', 'og:title', ogTitle);
  upsertMetaTag('property', 'og:description', ogDescription);
  upsertMetaTag('property', 'og:image', absoluteOgImage);
  upsertMetaTag('property', 'og:url', canonicalUrl);
  upsertMetaTag('property', 'og:site_name', config.ogSiteName || 'Harian Corporation Vietnam');
  upsertMetaTag('property', 'og:locale', ogLocale);
  upsertMetaTag('name', 'twitter:card', config.twitterCard || 'summary_large_image');
  upsertMetaTag('name', 'twitter:title', ogTitle);
  upsertMetaTag('name', 'twitter:description', ogDescription);
  upsertMetaTag('name', 'twitter:image', absoluteOgImage);
  upsertCanonicalLink(canonicalUrl);
  upsertJsonLd(jsonLd);
}
