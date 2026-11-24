import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { CareersSection } from './components/CareersSection';
import { ContactFooter } from './components/ContactFooter';
import { FloatingActionDock } from './components/FloatingActionDock';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { NewsSection } from './components/NewsSection';
import { ProductsSection } from './components/ProductsSection';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ServicesSection } from './components/ServicesSection';
import { CONSULTING_SERVICES, PRODUCTS as FALLBACK_PRODUCTS } from './data/catalog';
import { getResolvedSubDetails } from './data/productSubDetails';
import { INITIAL_SEO_SETTINGS } from './data/seoDefaults';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { SERVICES_EN, SERVICES_JA } from './i18n/translations';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductSubDetailPage } from './pages/ProductSubDetailPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AppRoute, JobPosting, NewsArticle, ProductItem, SeoSectionConfig, SeoSectionKey } from './types';
import { applyDocumentSeo } from './utils/seoHead';

const SECTION_ID_TO_SEO_KEY: Record<string, SeoSectionKey> = {
  top: 'home',
  'dich-vu': 'services',
  'san-pham': 'products',
  'tin-tuc': 'news',
  'tuyen-dung': 'careers',
  'lien-he': 'contact',
};

const SEO_KEY_TO_SECTION_ID: Record<SeoSectionKey, string | undefined> = {
  home: undefined,
  services: 'dich-vu',
  products: 'san-pham',
  news: 'tin-tuc',
  careers: 'tuyen-dung',
  contact: 'lien-he',
};

function parseHashToRoute(): AppRoute {
  const hash = window.location.hash || '';
  if (hash.startsWith('#/san-pham/')) {
    const rest = hash.replace('#/san-pham/', '');
    const parts = rest.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { name: 'product-subdetail', id: parts[0], subSlug: parts[1] };
    }
    return { name: 'product-detail', id: parts[0] || '' };
  }
  if (hash.startsWith('#/dich-vu/')) {
    return { name: 'service-detail', id: hash.replace('#/dich-vu/', '') };
  }
  if (hash.startsWith('#/tin-tuc/')) {
    return { name: 'news-detail', id: hash.replace('#/tin-tuc/', '') };
  }
  if (hash.startsWith('#/tuyen-dung/')) {
    return { name: 'job-detail', id: hash.replace('#/tuyen-dung/', '') };
  }
  if (hash.startsWith('#/quan-tri')) {
    const sub = hash.replace('#/quan-tri/', '').replace('#/quan-tri', '');
    const tab =
      sub === 'products' ||
      sub === 'sales' ||
      sub === 'news' ||
      sub === 'recruitment' ||
      sub === 'contacts' ||
      sub === 'seo'
        ? sub
        : 'overview';
    return { name: 'admin', tab };
  }
  return { name: 'home' };
}

function AppShell() {
  const { lang } = useLanguage();
  const [route, setRoute] = useState<AppRoute>(() => parseHashToRoute());
  const [preselectedService, setPreselectedService] = useState('');
  const [preselectedProduct, setPreselectedProduct] = useState('');

  const [products, setProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSectionConfig[]>(INITIAL_SEO_SETTINGS);
  const [activeHomeSection, setActiveHomeSection] = useState<SeoSectionKey>('home');

  async function refreshCatalogData() {
    try {
      const [prodR, newsR, jobR, seoR] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/news'),
        fetch('/api/jobs'),
        fetch('/api/seo'),
      ]);
      if (prodR.ok) setProducts(await prodR.json());
      if (newsR.ok) setNews(await newsR.json());
      if (jobR.ok) setJobs(await jobR.json());
      if (seoR.ok) {
        const loadedSeo = await seoR.json();
        if (Array.isArray(loadedSeo) && loadedSeo.length > 0) {
          setSeoSettings(loadedSeo);
        }
      }
    } catch {
      // Keep fallback data if network error occurs
    }
  }

  useEffect(() => {
    refreshCatalogData();
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashToRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route.name !== 'home') return;
    const sectionIds = ['top', 'dich-vu', 'san-pham', 'tin-tuc', 'tuyen-dung', 'lien-he'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const matchedKey = SECTION_ID_TO_SEO_KEY[visible[0].target.id];
          if (matchedKey) {
            setActiveHomeSection(matchedKey);
          }
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route.name]);

  function navigateTo(next: AppRoute, hashStr: string) {
    window.location.hash = hashStr;
    setRoute(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateHomeSection(sectionId?: string) {
    const targetKey = sectionId ? SECTION_ID_TO_SEO_KEY[sectionId] || 'home' : 'home';
    setActiveHomeSection(targetKey);
    if (route.name !== 'home') {
      window.location.hash = '';
      setRoute({ name: 'home' });
      setTimeout(() => {
        if (sectionId) {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
      return;
    }
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleOpenBooking(defaultService?: string) {
    if (defaultService) {
      setPreselectedService(defaultService);
    }
    navigateHomeSection('lien-he');
  }

  function handleRequestProductQuote(productName: string) {
    setPreselectedProduct(productName);
    setPreselectedService(
      lang === 'ja'
        ? SERVICES_JA['tu-van-noi-that-kien-truc'].title
        : lang === 'en'
        ? SERVICES_EN['tu-van-noi-that-kien-truc'].title
        : 'Tư vấn Thiết kế Nội thất & Kiến trúc'
    );
    navigateHomeSection('lien-he');
  }

  const visibleProducts = products.filter((p) => p.isVisible !== false);

  const activeProduct =
    route.name === 'product-detail' || route.name === 'product-subdetail'
      ? products.find((p) => p.id === route.id) || visibleProducts[0] || products[0]
      : null;

  const activeProductSubDetails = activeProduct
    ? getResolvedSubDetails(activeProduct, true)
    : [];

  const activeSubDetail =
    route.name === 'product-subdetail'
      ? activeProductSubDetails.find((s) => s.slug === route.subSlug) ||
        activeProductSubDetails[0] ||
        null
      : null;

  const activeService =
    route.name === 'service-detail'
      ? CONSULTING_SERVICES.find((s) => s.id === route.id) || CONSULTING_SERVICES[0]
      : null;

  const activeNews =
    route.name === 'news-detail'
      ? news.find((n) => n.id === route.id) || news[0]
      : null;

  const activeJob =
    route.name === 'job-detail'
      ? jobs.find((j) => j.id === route.id) || jobs[0]
      : null;

  useEffect(() => {
    applyDocumentSeo({
      route,
      activeHomeSection,
      seoSettings,
      lang,
      activeProduct,
      activeSubDetail,
      activeService,
      activeNews,
      activeJob,
    });
  }, [
    route,
    activeHomeSection,
    seoSettings,
    lang,
    activeProduct,
    activeSubDetail,
    activeService,
    activeNews,
    activeJob,
  ]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <ScrollProgressBar />
        <Navbar
          currentRoute={route}
          onNavigateHomeSection={navigateHomeSection}
          onNavigateAdmin={() =>
            navigateTo({ name: 'admin', tab: 'overview' }, '#/quan-tri')
          }
          onOpenBooking={() => handleOpenBooking()}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {route.name === 'home' && (
              <div key="home-view">
                <HeroSection onOpenBooking={handleOpenBooking} />
                <ServicesSection
                  onSelectServiceForBooking={handleOpenBooking}
                  onOpenServiceDetail={(id) =>
                    navigateTo({ name: 'service-detail', id }, `#/dich-vu/${id}`)
                  }
                />
                <ProductsSection
                  products={visibleProducts}
                  onOpenProductDetail={(id) =>
                    navigateTo({ name: 'product-detail', id }, `#/san-pham/${id}`)
                  }
                  onRequestProductQuote={handleRequestProductQuote}
                />
                <NewsSection
                  articles={news}
                  onOpenNewsDetail={(id) =>
                    navigateTo({ name: 'news-detail', id }, `#/tin-tuc/${id}`)
                  }
                  onOpenAdminNews={() =>
                    navigateTo({ name: 'admin', tab: 'news' }, '#/quan-tri/news')
                  }
                />
                <CareersSection
                  jobs={jobs}
                  onOpenJobDetail={(id) =>
                    navigateTo({ name: 'job-detail', id }, `#/tuyen-dung/${id}`)
                  }
                  onOpenAdminHr={() =>
                    navigateTo(
                      { name: 'admin', tab: 'recruitment' },
                      '#/quan-tri/recruitment'
                    )
                  }
                />
              </div>
            )}

            {route.name === 'product-detail' && activeProduct && (
              <ProductDetailPage
                key={`product-${activeProduct.id}`}
                product={activeProduct}
                allProducts={products}
                onBackHome={() => navigateHomeSection('san-pham')}
                onSelectProduct={(id) =>
                  navigateTo({ name: 'product-detail', id }, `#/san-pham/${id}`)
                }
                onSelectSubDetail={(productId, subSlug) =>
                  navigateTo(
                    { name: 'product-subdetail', id: productId, subSlug },
                    `#/san-pham/${productId}/${subSlug}`
                  )
                }
                onRequestConsultation={handleRequestProductQuote}
              />
            )}

            {route.name === 'product-subdetail' && activeProduct && activeSubDetail && (
              <ProductSubDetailPage
                key={`product-sub-${activeProduct.id}-${activeSubDetail.slug}`}
                product={activeProduct}
                subDetail={activeSubDetail}
                allSubDetails={activeProductSubDetails}
                onBackHome={() => navigateHomeSection('san-pham')}
                onBackToProduct={() =>
                  navigateTo(
                    { name: 'product-detail', id: activeProduct.id },
                    `#/san-pham/${activeProduct.id}`
                  )
                }
                onSelectSubDetail={(subSlug) =>
                  navigateTo(
                    { name: 'product-subdetail', id: activeProduct.id, subSlug },
                    `#/san-pham/${activeProduct.id}/${subSlug}`
                  )
                }
              />
            )}

            {route.name === 'service-detail' && activeService && (
              <ServiceDetailPage
                key={`service-${activeService.id}`}
                service={activeService}
                onBackHome={() => navigateHomeSection('dich-vu')}
                onSelectService={(id) =>
                  navigateTo({ name: 'service-detail', id }, `#/dich-vu/${id}`)
                }
              />
            )}

            {route.name === 'news-detail' && activeNews && (
              <NewsDetailPage
                key={`news-${activeNews.id}`}
                article={activeNews}
                allArticles={news}
                onBackHome={() => navigateHomeSection('tin-tuc')}
                onSelectArticle={(id) =>
                  navigateTo({ name: 'news-detail', id }, `#/tin-tuc/${id}`)
                }
              />
            )}

            {route.name === 'job-detail' && activeJob && (
              <JobDetailPage
                key={`job-${activeJob.id}`}
                job={activeJob}
                onBackHome={() => navigateHomeSection('tuyen-dung')}
              />
            )}

            {route.name === 'admin' && (
              <AdminPortalPage
                key="admin-portal"
                initialTab={route.tab || 'overview'}
                onBackHome={() => {
                  refreshCatalogData();
                  navigateHomeSection();
                }}
                onCatalogUpdated={refreshCatalogData}
                onOpenPublicProduct={(id) =>
                  navigateTo({ name: 'product-detail', id }, `#/san-pham/${id}`)
                }
                onJumpToSiteSection={(section) =>
                  navigateHomeSection(SEO_KEY_TO_SECTION_ID[section])
                }
              />
            )}
          </AnimatePresence>
        </main>

        <ContactFooter
          preselectedService={preselectedService}
          preselectedProduct={preselectedProduct}
          showContactForm={route.name === 'home'}
          onNavigateHomeSection={navigateHomeSection}
          onNavigateAdmin={() =>
            navigateTo({ name: 'admin', tab: 'overview' }, '#/quan-tri')
          }
        />
        <FloatingActionDock />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
