export type ProductCategory =
  | 'Giải pháp về không khí trong nhà'
  | 'Khoáng chất tốt cho sức khỏe';

export interface ProductSpec {
  label: string;
  value: string;
}

export type AppLanguage = 'vi' | 'en' | 'ja';

export interface LocalizedProductContent {
  name?: string;
  subtitle?: string;
  category?: string;
  stockLabel?: string;
  origin?: string;
  summary?: string;
  variants?: string[];
  highlights?: string[];
  specs?: ProductSpec[];
}

export type ProductTranslations = Partial<Record<AppLanguage, LocalizedProductContent>>;

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  priceVnd: number;
  priceLabel: string;
  stock: number;
  stockLabel: string;
  variants: string[];
  origin: string;
  summary: string;
  highlights: string[];
  specs: ProductSpec[];
  imageKey: 'kirara_cream' | 'kirara_liquid' | 'gko' | 'donan' | 'kirara_stone';
  featured?: boolean;
  isVisible?: boolean;
  translations?: ProductTranslations;
  subDetails?: ProductSubDetail[];
}

export interface KiraraColorSwatch {
  code: string;
  name: string;
  hex: string;
}

export interface ConsultingService {
  id: string;
  index: string;
  title: string;
  category: 'Tư vấn doanh nghiệp' | 'Giải pháp kỹ thuật';
  priceLabel: string;
  summary: string;
  deliverables: string[];
}

export type NewsCategory = 'Sự kiện' | 'Hợp tác quốc tế' | 'Thị trường' | 'Công nghệ Kirara';
export type NewsStatus = 'published' | 'draft';

export interface NewsArticle {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  status: NewsStatus;
  imageKey: 'hero_living' | 'consulting' | 'kirara_cream' | 'kirara_liquid' | 'bathroom';
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  deadline: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isOpen: boolean;
}

export type ApplicationStatus = 'Mới tiếp nhận' | 'Đang phỏng vấn' | 'Đạt yêu cầu' | 'Lưu hồ sơ';

export interface JobApplication {
  id: string;
  code: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experienceYears: string;
  languageLevel: string;
  portfolioUrl: string;
  resumeName: string;
  resumeSummary: string;
  coverLetter: string;
  status: ApplicationStatus;
  submittedAt: string;
}

export type ConsultationStatus = 'Chờ liên hệ' | 'Đã lên lịch' | 'Hoàn thành';

export interface ConsultationRequest {
  id: string;
  code: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  serviceType: string;
  productInterest: string;
  preferredDate: string;
  message: string;
  status: ConsultationStatus;
  notes?: string;
  submittedAt: string;
}

export type OrderStatus =
  | 'Chờ xác nhận'
  | 'Đang xử lý'
  | 'Đang giao hàng'
  | 'Hoàn tất'
  | 'Đã hủy';

export interface SalesOrder {
  id: string;
  code: string;
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  unitPriceVnd: number;
  totalVnd: number;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  note: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ProductSubDetailSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface ProductSubDetailMetric {
  value: string;
  label: string;
  note?: string;
}

export interface ProductSubDetailRow {
  label: string;
  primaryValue: string;
  secondaryValue?: string;
}

export interface ProductSubDetailFaq {
  q: string;
  a: string;
}

export interface ProductSubDetailExample {
  title: string;
  location: string;
  area: string;
  note: string;
}

export interface ProductSubDetailLocale {
  cardTitle: string;
  pageTitle: string;
  eyebrow: string;
  lead: string;
  sections: ProductSubDetailSection[];
  metrics?: ProductSubDetailMetric[];
  comparisonRows?: ProductSubDetailRow[];
  comparisonHeaders?: [string, string, string?];
  faqs?: ProductSubDetailFaq[];
  examples?: ProductSubDetailExample[];
}

export interface ProductSubDetail {
  slug: string;
  imageKey: 'hero_living' | 'consulting' | 'kirara_cream' | 'kirara_liquid' | 'bathroom';
  kind: 'editorial' | 'order' | 'inquiry';
  isVisible?: boolean;
  vi: ProductSubDetailLocale;
  en?: ProductSubDetailLocale;
  ja: ProductSubDetailLocale;
}

export type SeoSectionKey =
  | 'home'
  | 'services'
  | 'products'
  | 'news'
  | 'careers'
  | 'contact';

export interface SeoLocalizedTags {
  title: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
}

export interface SeoSectionConfig {
  section: SeoSectionKey;
  ogType: 'website' | 'article' | 'product';
  ogImage: string;
  ogSiteName: string;
  twitterCard: 'summary_large_image' | 'summary';
  canonicalPath: string;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  keywords: string;
  vi: SeoLocalizedTags;
  en: SeoLocalizedTags;
  ja: SeoLocalizedTags;
  updatedAt?: string;
}

export type AppRoute =
  | { name: 'home' }
  | { name: 'product-detail'; id: string }
  | { name: 'product-subdetail'; id: string; subSlug: string }
  | { name: 'service-detail'; id: string }
  | { name: 'news-detail'; id: string }
  | { name: 'job-detail'; id: string }
  | {
      name: 'admin';
      tab?: 'overview' | 'products' | 'sales' | 'news' | 'recruitment' | 'contacts' | 'seo';
    };

