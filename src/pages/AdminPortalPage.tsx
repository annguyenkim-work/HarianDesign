import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Edit3,
  FileText,
  Globe,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { AdminProductsModule } from '../components/AdminProductsModule';
import { AdminSeoModule } from '../components/AdminSeoModule';
import { useLanguage } from '../i18n/LanguageContext';
import { resolveProductLocale } from '../i18n/productLocale';
import { APP_STATUS_LABELS, NEWS_CATEGORY_LABELS } from '../i18n/translations';
import {
  ApplicationStatus,
  ConsultationRequest,
  ConsultationStatus,
  JobApplication,
  JobPosting,
  NewsArticle,
  NewsCategory,
  NewsStatus,
  OrderStatus,
  ProductItem,
  SalesOrder,
  SeoSectionKey,
} from '../types';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'sales'
  | 'news'
  | 'recruitment'
  | 'contacts'
  | 'seo';

interface AdminPortalPageProps {
  initialTab?: AdminTab;
  onBackHome: () => void;
  onCatalogUpdated: () => void;
  onOpenPublicProduct?: (productId: string) => void;
  onJumpToSiteSection?: (section: SeoSectionKey) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const ORDER_STATUSES: OrderStatus[] = [
  'Chờ xác nhận',
  'Đang xử lý',
  'Đang giao hàng',
  'Hoàn tất',
  'Đã hủy',
];

const APP_STATUSES: ApplicationStatus[] = [
  'Mới tiếp nhận',
  'Đang phỏng vấn',
  'Đạt yêu cầu',
  'Lưu hồ sơ',
];

const CONSULT_STATUSES: ConsultationStatus[] = [
  'Chờ liên hệ',
  'Đã lên lịch',
  'Hoàn thành',
];

export function AdminPortalPage({
  initialTab = 'overview',
  onBackHome,
  onCatalogUpdated,
  onOpenPublicProduct,
  onJumpToSiteSection,
}: AdminPortalPageProps) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [salesSubTab, setSalesSubTab] = useState<'orders' | 'products'>('orders');
  const [hrSubTab, setHrSubTab] = useState<'applications' | 'jobs'>('applications');

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);

  // News modal state
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Sự kiện' as NewsCategory,
    summary: '',
    content: '',
    author: 'Ban Biên tập Harian',
    publishedAt: new Date().toISOString().slice(0, 10),
    status: 'published' as NewsStatus,
    imageKey: 'consulting' as NewsArticle['imageKey'],
  });

  // Job modal state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Kỹ thuật & Thi công Kirara',
    location: 'Đà Nẵng',
    employmentType: 'Toàn thời gian',
    salaryRange: '12.000.000 – 18.000.000 VNĐ',
    deadline: '2026-12-31',
    summary: '',
    responsibilitiesText: '',
    requirementsText: '',
    benefitsText: '',
    isOpen: true,
  });

  // Product quick edit state
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productPriceInput, setProductPriceInput] = useState('');
  const [productStockInput, setProductStockInput] = useState('');

  // Consultation notes editing
  const [editingConsultId, setEditingConsultId] = useState<string | null>(null);
  const [consultNoteInput, setConsultNoteInput] = useState('');

  // Order filter
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');

  async function fetchAllAdminData() {
    setLoading(true);
    try {
      const [ordR, prodR, newsR, jobR, appR, consR] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/news'),
        fetch('/api/jobs'),
        fetch('/api/applications'),
        fetch('/api/consultations'),
      ]);
      if (ordR.ok) setOrders(await ordR.json());
      if (prodR.ok) setProducts(await prodR.json());
      if (newsR.ok) setNews(await newsR.json());
      if (jobR.ok) setJobs(await jobR.json());
      if (appR.ok) setApplications(await appR.json());
      if (consR.ok) setConsultations(await consR.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const metrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Đã hủy');
    const revenue = validOrders.reduce((acc, o) => acc + o.totalVnd, 0);
    const pendingOrders = orders.filter((o) => o.status === 'Chờ xác nhận').length;
    const publishedNews = news.filter((n) => n.status === 'published').length;
    const pendingApps = applications.filter((a) => a.status === 'Mới tiếp nhận').length;
    const pendingConsults = consultations.filter((c) => c.status === 'Chờ liên hệ').length;
    return {
      revenue,
      pendingOrders,
      publishedNews,
      pendingApps,
      pendingConsults,
    };
  }, [orders, news, applications, consultations]);

  // --- Handlers ---
  async function handleOrderStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchAllAdminData();
    }
  }

  async function handleSaveProduct(e: FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    const priceVnd = Math.max(0, Number(productPriceInput) || 0);
    const stock = Math.max(0, Number(productStockInput) || 0);
    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceVnd, stock }),
    });
    if (res.ok) {
      setEditingProduct(null);
      await fetchAllAdminData();
      onCatalogUpdated();
    }
  }

  async function handleSaveNews(e: FormEvent) {
    e.preventDefault();
    const url = editingNewsId ? `/api/news/${editingNewsId}` : '/api/news';
    const method = editingNewsId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsForm),
    });
    if (res.ok) {
      setNewsModalOpen(false);
      await fetchAllAdminData();
    }
  }

  async function handleToggleNewsStatus(article: NewsArticle) {
    const next: NewsStatus = article.status === 'published' ? 'draft' : 'published';
    const res = await fetch(`/api/news/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) await fetchAllAdminData();
  }

  async function handleDeleteNews(id: string) {
    const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchAllAdminData();
  }

  async function handleAppStatus(id: string, status: ApplicationStatus) {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await fetchAllAdminData();
  }

  async function handleSaveJob(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      employmentType: jobForm.employmentType,
      salaryRange: jobForm.salaryRange,
      deadline: jobForm.deadline,
      summary: jobForm.summary,
      responsibilities: jobForm.responsibilitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      requirements: jobForm.requirementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: jobForm.benefitsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      isOpen: jobForm.isOpen,
    };
    const url = editingJobId ? `/api/jobs/${editingJobId}` : '/api/jobs';
    const method = editingJobId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setJobModalOpen(false);
      await fetchAllAdminData();
    }
  }

  async function handleToggleJobOpen(job: JobPosting) {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOpen: !job.isOpen }),
    });
    if (res.ok) await fetchAllAdminData();
  }

  async function handleDeleteJob(id: string) {
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchAllAdminData();
  }

  async function handleConsultStatus(id: string, status: ConsultationStatus) {
    const res = await fetch(`/api/consultations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await fetchAllAdminData();
  }

  async function handleSaveConsultNote(id: string) {
    const res = await fetch(`/api/consultations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: consultNoteInput }),
    });
    if (res.ok) {
      setEditingConsultId(null);
      await fetchAllAdminData();
    }
  }

  const navItems: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
    {
      id: 'overview',
      label: lang === 'ja' ? '概要ダッシュボード' : lang === 'en' ? 'Overview' : 'Tổng quan',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      label:
        lang === 'ja'
          ? '製品・サブページ設定'
          : lang === 'en'
          ? 'Products & Sub-pages'
          : 'Sản phẩm & Trang con',
      icon: Layers,
    },
    {
      id: 'sales',
      label:
        lang === 'ja'
          ? '販売・注文管理'
          : lang === 'en'
          ? 'Orders & Inventory'
          : 'Đơn hàng & Kho',
      icon: ShoppingBag,
    },
    {
      id: 'news',
      label: lang === 'ja' ? 'ニュース管理' : lang === 'en' ? 'News CMS' : 'Quản lý Tin tức',
      icon: Newspaper,
    },
    {
      id: 'recruitment',
      label:
        lang === 'ja'
          ? '採用・応募管理'
          : lang === 'en'
          ? 'Recruitment & HR'
          : 'Tuyển dụng & Hồ sơ',
      icon: Briefcase,
    },
    {
      id: 'contacts',
      label:
        lang === 'ja'
          ? '相談・連絡管理'
          : lang === 'en'
          ? 'Consultations'
          : 'Liên hệ & Tư vấn',
      icon: MessageSquare,
    },
    {
      id: 'seo',
      label:
        lang === 'ja'
          ? 'SEO・OG設定'
          : lang === 'en'
          ? 'SEO Manager'
          : 'Quản lý SEO',
      icon: Globe,
    },
  ];

  const filteredOrders =
    orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="bg-[#F8FAFC] min-h-[85vh]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 lg:py-10">
        {/* Top Portal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-[#2C64AF] mb-1">
              {lang === 'ja'
                ? 'Harian 統合管理ポータル'
                : lang === 'en'
                ? 'Harian Integrated Admin Portal'
                : 'Cổng quản trị nội bộ Harian Corporation'}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {lang === 'ja'
                ? '業務・コンテンツ管理システム'
                : lang === 'en'
                ? 'Operations & Content Management'
                : 'Hệ thống Quản trị Doanh nghiệp'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAllAdminData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{lang === 'ja' ? '更新' : lang === 'en' ? 'Refresh' : 'Làm mới'}</span>
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {lang === 'ja'
                  ? '公開サイトへ'
                  : lang === 'en'
                  ? 'Public Site'
                  : 'Về trang công khai'}
              </span>
            </button>
          </div>
        </div>

        {/* Workspace Layout: Sidebar + Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'text-[#2C64AF] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-active-tab"
                      transition={{ duration: 0.2, ease: EASE }}
                      className="absolute inset-0 bg-[#EFF6FF] border border-[#2C64AF]/20 rounded-lg"
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10 shrink-0" />
                  <span className="relative z-10 truncate">{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Admin Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="space-y-8"
                >
                  {/* 4 KPI Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="text-xs text-slate-500 mb-1">
                        {lang === 'ja'
                          ? '受注合計金額'
                          : lang === 'en'
                          ? 'Total Order Value'
                          : 'Tổng giá trị đơn hàng'}
                      </div>
                      <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                        {metrics.revenue.toLocaleString('vi-VN')} VNĐ
                      </div>
                      <div className="text-xs text-[#2C64AF] mt-1 font-mono tabular-nums">
                        {orders.length} {lang === 'ja' ? '件' : lang === 'en' ? 'orders' : 'đơn'} ·{' '}
                        {metrics.pendingOrders}{' '}
                        {lang === 'ja'
                          ? '件確認待ち'
                          : lang === 'en'
                          ? 'pending'
                          : 'chờ xác nhận'}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="text-xs text-slate-500 mb-1">
                        {lang === 'ja'
                          ? 'ニュース記事'
                          : lang === 'en'
                          ? 'News Articles'
                          : 'Bài viết Tin tức'}
                      </div>
                      <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                        {metrics.publishedNews} / {news.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {lang === 'ja'
                          ? '公開中 / 総記事数'
                          : lang === 'en'
                          ? 'Published / Total'
                          : 'Đang xuất bản / Tổng số'}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="text-xs text-slate-500 mb-1">
                        {lang === 'ja'
                          ? '採用応募者数'
                          : lang === 'en'
                          ? 'Job Applications'
                          : 'Hồ sơ tuyển dụng'}
                      </div>
                      <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                        {applications.length}
                      </div>
                      <div className="text-xs text-emerald-700 mt-1 font-mono tabular-nums">
                        {metrics.pendingApps}{' '}
                        {lang === 'ja'
                          ? '件新規受付'
                          : lang === 'en'
                          ? 'new applications'
                          : 'hồ sơ mới tiếp nhận'}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="text-xs text-slate-500 mb-1">
                        {lang === 'ja'
                          ? '企業・施工相談'
                          : lang === 'en'
                          ? 'Consultation Requests'
                          : 'Yêu cầu tư vấn'}
                      </div>
                      <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                        {consultations.length}
                      </div>
                      <div className="text-xs text-amber-700 mt-1 font-mono tabular-nums">
                        {metrics.pendingConsults}{' '}
                        {lang === 'ja'
                          ? '件連絡待ち'
                          : lang === 'en'
                          ? 'awaiting contact'
                          : 'lịch hẹn chờ liên hệ'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders & Consultations */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">
                          {lang === 'ja'
                            ? '最新のご注文'
                            : lang === 'en'
                            ? 'Recent Orders'
                            : 'Đơn hàng gần nhất'}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setActiveTab('sales')}
                          className="text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                        >
                          {lang === 'ja'
                            ? 'すべて見る →'
                            : lang === 'en'
                            ? 'Manage sales →'
                            : 'Quản lý bán hàng →'}
                        </button>
                      </div>
                      <div className="divide-y divide-slate-200">
                        {orders.slice(0, 4).map((o) => (
                          <div key={o.id} className="px-5 py-3.5 flex items-center justify-between gap-4 text-sm">
                            <div>
                              <div className="font-mono text-xs text-[#2C64AF] tabular-nums">
                                {o.code}
                              </div>
                              <div className="font-semibold text-slate-900">{o.productName}</div>
                              <div className="text-xs text-slate-500">
                                {o.customerName} · SL: {o.quantity}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                                {o.totalVnd.toLocaleString('vi-VN')} VNĐ
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{o.status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">
                          {lang === 'ja'
                            ? '最新の相談・お問い合わせ'
                            : lang === 'en'
                            ? 'Recent Consultations'
                            : 'Liên hệ & Tư vấn mới'}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setActiveTab('contacts')}
                          className="text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                        >
                          {lang === 'ja'
                            ? 'すべて見る →'
                            : lang === 'en'
                            ? 'Manage contacts →'
                            : 'Quản lý liên hệ →'}
                        </button>
                      </div>
                      <div className="divide-y divide-slate-200">
                        {consultations.slice(0, 4).map((c) => (
                          <div key={c.id} className="px-5 py-3.5 flex items-center justify-between gap-4 text-sm">
                            <div className="min-w-0">
                              <div className="font-mono text-xs text-[#2C64AF] tabular-nums">
                                {c.code}
                              </div>
                              <div className="font-semibold text-slate-900 truncate">
                                {c.fullName} · {c.companyName}
                              </div>
                              <div className="text-xs text-slate-500 truncate">{c.serviceType}</div>
                            </div>
                            <div className="text-xs font-medium text-slate-700 shrink-0">
                              {c.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PRODUCTS & SUB-PAGES CMS TAB */}
              {activeTab === 'products' && (
                <AdminProductsModule
                  key="products-module"
                  products={products}
                  onProductsChanged={async () => {
                    await fetchAllAdminData();
                    onCatalogUpdated();
                  }}
                  onOpenPublicProduct={onOpenPublicProduct}
                />
              )}

              {/* SEO & OPEN GRAPH MANAGER TAB */}
              {activeTab === 'seo' && (
                <AdminSeoModule
                  key="seo-module"
                  onSeoChanged={onCatalogUpdated}
                  onJumpToSection={onJumpToSiteSection}
                />
              )}

              {/* SALES & INVENTORY TAB */}
              {activeTab === 'sales' && (
                <motion.div
                  key="sales"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setSalesSubTab('orders')}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                          salesSubTab === 'orders'
                            ? 'bg-[#2C64AF] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'ja'
                          ? `注文一覧 (${orders.length})`
                          : lang === 'en'
                          ? `Orders (${orders.length})`
                          : `Đơn hàng (${orders.length})`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSalesSubTab('products')}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                          salesSubTab === 'products'
                            ? 'bg-[#2C64AF] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'ja'
                          ? `製品・在庫管理 (${products.length})`
                          : lang === 'en'
                          ? `Inventory & Pricing (${products.length})`
                          : `Sản phẩm & Tồn kho (${products.length})`}
                      </button>
                    </div>

                    {salesSubTab === 'orders' && (
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value as typeof orderFilter)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                      >
                        <option value="all">
                          {lang === 'ja'
                            ? 'すべてのステータス'
                            : lang === 'en'
                            ? 'All statuses'
                            : 'Tất cả trạng thái'}
                        </option>
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {salesSubTab === 'orders' ? (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                              <th className="py-3.5 px-5">
                                {lang === 'ja'
                                  ? '注文番号 · 顧客'
                                  : lang === 'en'
                                  ? 'Order · Customer'
                                  : 'Mã đơn · Khách hàng'}
                              </th>
                              <th className="py-3.5 px-4">
                                {lang === 'ja'
                                  ? '製品・数量'
                                  : lang === 'en'
                                  ? 'Product · Qty'
                                  : 'Sản phẩm · SL'}
                              </th>
                              <th className="py-3.5 px-4">
                                {lang === 'ja'
                                  ? '配送先'
                                  : lang === 'en'
                                  ? 'Shipping Address'
                                  : 'Địa chỉ giao hàng'}
                              </th>
                              <th className="py-3.5 px-4 text-right">
                                {lang === 'ja' ? '合計金額' : lang === 'en' ? 'Total' : 'Tổng tiền'}
                              </th>
                              <th className="py-3.5 px-5 text-right">
                                {lang === 'ja' ? 'ステータス' : lang === 'en' ? 'Status' : 'Trạng thái'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {filteredOrders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-slate-50/70 align-top">
                                <td className="py-4 px-5">
                                  <div className="font-mono text-xs text-[#2C64AF] tabular-nums">
                                    {ord.code}
                                  </div>
                                  <div className="font-semibold text-slate-900 mt-0.5">
                                    {ord.customerName}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {ord.companyName} · {ord.phone}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-medium text-slate-900">{ord.productName}</div>
                                  <div className="text-xs text-slate-500">
                                    {ord.variant} · SL:{' '}
                                    <span className="font-mono font-semibold text-slate-800">
                                      {ord.quantity}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                                  <div>{ord.shippingAddress}</div>
                                  {ord.note && (
                                    <div className="text-slate-400 mt-1">{ord.note}</div>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                                  {ord.totalVnd.toLocaleString('vi-VN')} VNĐ
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <select
                                    value={ord.status}
                                    onChange={(e) =>
                                      handleOrderStatus(ord.id, e.target.value as OrderStatus)
                                    }
                                    className="px-2.5 py-1.5 text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-lg text-slate-800 cursor-pointer"
                                  >
                                    {ORDER_STATUSES.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                              <th className="py-3.5 px-5">
                                SKU · {lang === 'ja' ? '製品名' : lang === 'en' ? 'Product' : 'Sản phẩm'}
                              </th>
                              <th className="py-3.5 px-4">
                                {lang === 'ja' ? 'カテゴリー' : lang === 'en' ? 'Category' : 'Danh mục'}
                              </th>
                              <th className="py-3.5 px-4 text-right">
                                {lang === 'ja' ? '単価' : lang === 'en' ? 'Unit Price' : 'Đơn giá'}
                              </th>
                              <th className="py-3.5 px-4 text-right">
                                {lang === 'ja' ? '在庫数' : lang === 'en' ? 'Stock' : 'Tồn kho'}
                              </th>
                              <th className="py-3.5 px-5 text-right">
                                {lang === 'ja' ? '編集' : lang === 'en' ? 'Actions' : 'Cập nhật'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {products.map((prod) => {
                              const locProd = resolveProductLocale(prod, lang);
                              return (
                                <tr key={prod.id} className="hover:bg-slate-50/70">
                                  <td className="py-4 px-5">
                                    <div className="font-mono text-xs text-slate-500">{prod.sku}</div>
                                    <div className="font-semibold text-slate-900">{locProd.name}</div>
                                  </td>
                                  <td className="py-4 px-4 text-xs text-slate-600">{locProd.category}</td>
                                  <td className="py-4 px-4 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
                                    {prod.priceLabel}
                                  </td>
                                  <td className="py-4 px-4 text-right font-mono text-xs font-semibold text-slate-800 tabular-nums">
                                    {prod.stock}
                                  </td>
                                  <td className="py-4 px-5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProduct(prod);
                                        setProductPriceInput(String(prod.priceVnd));
                                        setProductStockInput(String(prod.stock));
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#2C64AF] border border-slate-200 rounded-md hover:border-[#2C64AF] cursor-pointer"
                                    >
                                      <Package className="w-3.5 h-3.5" />
                                      <span>
                                        {lang === 'ja'
                                          ? '価格・在庫変更'
                                          : lang === 'en'
                                          ? 'Edit Price / Stock'
                                          : 'Sửa giá / kho'}
                                      </span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* NEWS CMS TAB */}
              {activeTab === 'news' && (
                <motion.div
                  key="news"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      {lang === 'ja'
                        ? '公開記事・下書きの一元管理'
                        : lang === 'en'
                        ? 'Manage all published articles & drafts'
                        : 'Quản lý toàn bộ bài viết & thông báo'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNewsId(null);
                        setNewsForm({
                          title: '',
                          category: 'Sự kiện',
                          summary: '',
                          content: '',
                          author: 'Ban Biên tập Harian',
                          publishedAt: new Date().toISOString().slice(0, 10),
                          status: 'published',
                          imageKey: 'consulting',
                        });
                        setNewsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {lang === 'ja'
                          ? '新規記事作成'
                          : lang === 'en'
                          ? 'New Article'
                          : 'Soạn bài viết mới'}
                      </span>
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                            <th className="py-3.5 px-5">
                              {lang === 'ja' ? 'タイトル' : lang === 'en' ? 'Title' : 'Tiêu đề'}
                            </th>
                            <th className="py-3.5 px-4">
                              {lang === 'ja'
                                ? 'カテゴリー'
                                : lang === 'en'
                                ? 'Category'
                                : 'Chuyên mục'}
                            </th>
                            <th className="py-3.5 px-4">
                              {lang === 'ja' ? '公開日' : lang === 'en' ? 'Date' : 'Ngày đăng'}
                            </th>
                            <th className="py-3.5 px-4">
                              {lang === 'ja' ? '状態' : lang === 'en' ? 'Status' : 'Trạng thái'}
                            </th>
                            <th className="py-3.5 px-5 text-right">
                              {lang === 'ja' ? '操作' : lang === 'en' ? 'Actions' : 'Thao tác'}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {news.map((art) => (
                            <tr key={art.id} className="hover:bg-slate-50/70">
                              <td className="py-4 px-5 max-w-md">
                                <div className="font-semibold text-slate-900 line-clamp-1">
                                  {art.title}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                  {art.author}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                                {NEWS_CATEGORY_LABELS[art.category]?.[lang] || art.category}
                              </td>
                              <td className="py-4 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                                {art.publishedAt}
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleNewsStatus(art)}
                                  className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                                    art.status === 'published'
                                      ? 'text-emerald-700'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>
                                    {art.status === 'published'
                                      ? lang === 'ja'
                                        ? '公開中'
                                        : lang === 'en'
                                        ? 'Published'
                                        : 'Đã xuất bản'
                                      : lang === 'ja'
                                      ? '下書き'
                                      : lang === 'en'
                                      ? 'Draft'
                                      : 'Bản nháp'}
                                  </span>
                                </button>
                              </td>
                              <td className="py-4 px-5 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingNewsId(art.id);
                                      setNewsForm({
                                        title: art.title,
                                        category: art.category,
                                        summary: art.summary,
                                        content: art.content,
                                        author: art.author,
                                        publishedAt: art.publishedAt,
                                        status: art.status,
                                        imageKey: art.imageKey,
                                      });
                                      setNewsModalOpen(true);
                                    }}
                                    className="p-1.5 text-slate-600 hover:text-[#2C64AF] border border-slate-200 rounded-md cursor-pointer"
                                    title="Sửa"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteNews(art.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 border border-slate-200 rounded-md cursor-pointer"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RECRUITMENT & HR TAB */}
              {activeTab === 'recruitment' && (
                <motion.div
                  key="recruitment"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setHrSubTab('applications')}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                          hrSubTab === 'applications'
                            ? 'bg-[#2C64AF] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'ja'
                          ? `応募者 (${applications.length})`
                          : lang === 'en'
                          ? `Candidates (${applications.length})`
                          : `Hồ sơ ứng viên (${applications.length})`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setHrSubTab('jobs')}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                          hrSubTab === 'jobs'
                            ? 'bg-[#2C64AF] text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'ja'
                          ? `求人ポジション (${jobs.length})`
                          : lang === 'en'
                          ? `Open Roles (${jobs.length})`
                          : `Vị trí tuyển dụng (${jobs.length})`}
                      </button>
                    </div>

                    {hrSubTab === 'jobs' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingJobId(null);
                          setJobForm({
                            title: '',
                            department: 'Kỹ thuật & Thi công Kirara',
                            location: 'Đà Nẵng',
                            employmentType: 'Toàn thời gian',
                            salaryRange: '12.000.000 – 18.000.000 VNĐ',
                            deadline: '2026-12-31',
                            summary: '',
                            responsibilitiesText: '',
                            requirementsText: '',
                            benefitsText: '',
                            isOpen: true,
                          });
                          setJobModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {lang === 'ja'
                            ? '求人を追加'
                            : lang === 'en'
                            ? 'Add Job Posting'
                            : 'Thêm tin tuyển dụng'}
                        </span>
                      </button>
                    )}
                  </div>

                  {hrSubTab === 'applications' ? (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-[#F8FAFC] border-b border-slate-200 text-xs font-semibold text-slate-600">
                              <th className="py-3.5 px-5">
                                {lang === 'ja' ? '応募者' : lang === 'en' ? 'Candidate' : 'Ứng viên'}
                              </th>
                              <th className="py-3.5 px-4">
                                {lang === 'ja' ? '応募職種' : lang === 'en' ? 'Role' : 'Vị trí'}
                              </th>
                              <th className="py-3.5 px-4">
                                {lang === 'ja'
                                  ? '経歴・語学'
                                  : lang === 'en'
                                  ? 'Experience'
                                  : 'Kinh nghiệm'}
                              </th>
                              <th className="py-3.5 px-4">CV</th>
                              <th className="py-3.5 px-5 text-right">
                                {lang === 'ja' ? '状態' : lang === 'en' ? 'Status' : 'Trạng thái'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {applications.map((app) => (
                              <tr key={app.id} className="hover:bg-slate-50/70 align-top">
                                <td className="py-4 px-5">
                                  <div className="font-mono text-xs text-[#2C64AF] tabular-nums">
                                    {app.code}
                                  </div>
                                  <div className="font-semibold text-slate-900">{app.fullName}</div>
                                  <div className="text-xs text-slate-500">
                                    {app.email} · {app.phone}
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <div className="font-medium text-slate-800">{app.jobTitle}</div>
                                  <p className="text-xs text-slate-500 mt-1 max-w-xs line-clamp-2">
                                    {app.coverLetter}
                                  </p>
                                </td>
                                <td className="py-4 px-4 text-xs text-slate-600">
                                  <div>{app.experienceYears}</div>
                                  <div className="text-slate-500">{app.languageLevel}</div>
                                </td>
                                <td className="py-4 px-4 text-xs text-slate-700">
                                  <span className="inline-flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5 text-[#2C64AF]" />
                                    <span className="truncate max-w-[140px]">{app.resumeName}</span>
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <select
                                    value={app.status}
                                    onChange={(e) =>
                                      handleAppStatus(app.id, e.target.value as ApplicationStatus)
                                    }
                                    className="px-2.5 py-1.5 text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-lg cursor-pointer"
                                  >
                                    {APP_STATUSES.map((st) => (
                                      <option key={st} value={st}>
                                        {APP_STATUS_LABELS[st]?.[lang] || st}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                              <span className="text-[#2C64AF] font-medium">{job.department}</span>
                              <span>·</span>
                              <span>{job.location}</span>
                              <span>·</span>
                              <span className="font-mono tabular-nums">{job.salaryRange}</span>
                            </div>
                            <div className="font-semibold text-slate-900">{job.title}</div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleJobOpen(job)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer ${
                                job.isOpen
                                  ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50'
                                  : 'text-slate-600 border-slate-200 bg-slate-50'
                              }`}
                            >
                              {job.isOpen
                                ? lang === 'ja'
                                  ? '募集中'
                                  : lang === 'en'
                                  ? 'Open'
                                  : 'Đang mở'
                                : lang === 'ja'
                                ? '募集停止'
                                : lang === 'en'
                                ? 'Closed'
                                : 'Đã đóng'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingJobId(job.id);
                                setJobForm({
                                  title: job.title,
                                  department: job.department,
                                  location: job.location,
                                  employmentType: job.employmentType,
                                  salaryRange: job.salaryRange,
                                  deadline: job.deadline,
                                  summary: job.summary,
                                  responsibilitiesText: job.responsibilities.join('\n'),
                                  requirementsText: job.requirements.join('\n'),
                                  benefitsText: job.benefits.join('\n'),
                                  isOpen: job.isOpen,
                                });
                                setJobModalOpen(true);
                              }}
                              className="p-1.5 text-slate-600 hover:text-[#2C64AF] border border-slate-200 rounded-md cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 border border-slate-200 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* CONTACTS & CONSULTATIONS TAB */}
              {activeTab === 'contacts' && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200"
                >
                  {consultations.map((c) => (
                    <div key={c.id} className="p-6 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <span className="font-mono text-[#2C64AF] font-semibold">{c.code}</span>
                            <span>·</span>
                            <span>{c.serviceType}</span>
                            {c.preferredDate && (
                              <>
                                <span>·</span>
                                <span className="font-mono">Hẹn: {c.preferredDate}</span>
                              </>
                            )}
                          </div>
                          <div className="font-bold text-slate-900">
                            {c.fullName} ·{' '}
                            <span className="font-normal text-slate-600">{c.companyName}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {c.email} · {c.phone} · {c.productInterest}
                          </div>
                        </div>

                        <select
                          value={c.status}
                          onChange={(e) =>
                            handleConsultStatus(c.id, e.target.value as ConsultationStatus)
                          }
                          className="px-3 py-1.5 text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-lg cursor-pointer"
                        >
                          {CONSULT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      {c.message && (
                        <p className="text-sm text-slate-700 bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200/80">
                          {c.message}
                        </p>
                      )}

                      {editingConsultId === c.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={consultNoteInput}
                            onChange={(e) => setConsultNoteInput(e.target.value)}
                            placeholder="Nhập ghi chú xử lý nội bộ..."
                            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveConsultNote(c.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2C64AF] rounded-lg cursor-pointer"
                          >
                            Lưu ghi chú
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingConsultId(null)}
                            className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>
                            Ghi chú nội bộ:{' '}
                            <strong className="font-normal text-slate-700">
                              {c.notes || 'Chưa có ghi chú'}
                            </strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingConsultId(c.id);
                              setConsultNoteInput(c.notes || '');
                            }}
                            className="text-[#2C64AF] font-semibold hover:underline cursor-pointer"
                          >
                            Cập nhật ghi chú
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Cập nhật giá & tồn kho: {editingProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn giá (VNĐ)
                </label>
                <input
                  type="number"
                  min={0}
                  value={productPriceInput}
                  onChange={(e) => setProductPriceInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  min={0}
                  value={productStockInput}
                  onChange={(e) => setProductStockInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs border border-slate-200 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] rounded-lg cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Create/Edit Modal */}
      {newsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setNewsModalOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingNewsId ? 'Chỉnh sửa bài viết' : 'Soạn bài viết mới'}
              </h3>
              <button
                type="button"
                onClick={() => setNewsModalOpen(false)}
                className="p-1.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNews} className="space-y-4">
              <input
                type="text"
                required
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                placeholder="Tiêu đề bài viết..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newsForm.category}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, category: e.target.value as NewsCategory })
                  }
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Hợp tác quốc tế">Hợp tác quốc tế</option>
                  <option value="Thị trường">Thị trường</option>
                  <option value="Công nghệ Kirara">Công nghệ Kirara</option>
                </select>
                <input
                  type="date"
                  value={newsForm.publishedAt}
                  onChange={(e) => setNewsForm({ ...newsForm, publishedAt: e.target.value })}
                  className="px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                />
                <select
                  value={newsForm.status}
                  onChange={(e) =>
                    setNewsForm({ ...newsForm, status: e.target.value as NewsStatus })
                  }
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="published">Xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
              <textarea
                rows={2}
                required
                value={newsForm.summary}
                onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                placeholder="Tóm tắt ngắn..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <textarea
                rows={5}
                required
                value={newsForm.content}
                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                placeholder="Nội dung chi tiết..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(false)}
                  className="px-4 py-2 text-xs border border-slate-200 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#2C64AF] rounded-lg cursor-pointer"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Create/Edit Modal */}
      {jobModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setJobModalOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                {editingJobId ? 'Cập nhật vị trí tuyển dụng' : 'Tạo tin tuyển dụng mới'}
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="p-1.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveJob} className="space-y-4">
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="Tên vị trí tuyển dụng..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={jobForm.department}
                  onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  placeholder="Phòng ban"
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="Địa điểm"
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
                <input
                  type="text"
                  value={jobForm.salaryRange}
                  onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                  placeholder="Mức lương"
                  className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <textarea
                rows={2}
                value={jobForm.summary}
                onChange={(e) => setJobForm({ ...jobForm, summary: e.target.value })}
                placeholder="Mô tả tổng quan vị trí..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <textarea
                rows={3}
                value={jobForm.responsibilitiesText}
                onChange={(e) =>
                  setJobForm({ ...jobForm, responsibilitiesText: e.target.value })
                }
                placeholder="Trách nhiệm (mỗi dòng 1 ý)..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <textarea
                rows={3}
                value={jobForm.requirementsText}
                onChange={(e) => setJobForm({ ...jobForm, requirementsText: e.target.value })}
                placeholder="Yêu cầu ứng viên (mỗi dòng 1 ý)..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 text-xs border border-slate-200 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#2C64AF] rounded-lg cursor-pointer"
                >
                  Lưu tin tuyển dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
