import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ARTICLE_IMAGES, PRODUCT_IMAGES } from '../data/catalog';
import { createStarterSubDetails, getResolvedSubDetails } from '../data/productSubDetails';
import { useLanguage } from '../i18n/LanguageContext';
import { resolveProductLocale } from '../i18n/productLocale';
import { PRODUCT_CATEGORY_EN, PRODUCT_CATEGORY_JA } from '../i18n/translations';
import {
  AppLanguage,
  LocalizedProductContent,
  ProductCategory,
  ProductItem,
  ProductSubDetail,
  ProductSubDetailFaq,
  ProductSubDetailLocale,
  ProductSubDetailMetric,
  ProductSubDetailRow,
  ProductSubDetailSection,
  ProductTranslations,
} from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface AdminProductsModuleProps {
  products: ProductItem[];
  onProductsChanged: () => Promise<void> | void;
  onOpenPublicProduct?: (productId: string) => void;
}

const PRODUCT_IMAGE_CHOICES: Array<{
  key: ProductItem['imageKey'];
  label: string;
}> = [
  { key: 'kirara_cream', label: 'KIRARA Cream (Vật liệu tường)' },
  { key: 'kirara_liquid', label: 'KIRARA Liquid (Phun phủ)' },
  { key: 'gko', label: 'G.K.O (Xử lý nấm mốc)' },
  { key: 'kirara_stone', label: 'Đá Kirara (Khoáng tự nhiên)' },
  { key: 'donan', label: 'Cân bằng khoáng chất Donan' },
];

const SUB_IMAGE_CHOICES: Array<{
  key: ProductSubDetail['imageKey'];
  label: string;
}> = [
  { key: 'hero_living', label: 'Không gian sống' },
  { key: 'consulting', label: 'Tư vấn & Thi công' },
  { key: 'kirara_cream', label: 'Sản phẩm Kirara Cream' },
  { key: 'kirara_liquid', label: 'Dung dịch Kirara Liquid' },
  { key: 'bathroom', label: 'Khoáng chất & Nước sạch' },
];

const CATEGORIES: ProductCategory[] = [
  'Giải pháp về không khí trong nhà',
  'Khoáng chất tốt cho sức khỏe',
];

const LANG_OPTIONS: Array<{
  code: AppLanguage;
  short: string;
  label: string;
}> = [
  { code: 'vi', short: 'VI', label: 'Tiếng Việt' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ja', short: 'JA', label: '日本語' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function cloneSubLocale(loc?: ProductSubDetailLocale): ProductSubDetailLocale {
  return {
    cardTitle: loc?.cardTitle || '',
    pageTitle: loc?.pageTitle || '',
    eyebrow: loc?.eyebrow || '',
    lead: loc?.lead || '',
    sections: Array.isArray(loc?.sections)
      ? loc.sections.map((sec) => ({
          ...sec,
          bullets: sec.bullets ? [...sec.bullets] : [],
        }))
      : [],
    metrics: Array.isArray(loc?.metrics) ? loc.metrics.map((m) => ({ ...m })) : [],
    comparisonHeaders: loc?.comparisonHeaders
      ? ([...loc.comparisonHeaders] as [string, string, string?])
      : undefined,
    comparisonRows: Array.isArray(loc?.comparisonRows)
      ? loc.comparisonRows.map((r) => ({ ...r }))
      : [],
    faqs: Array.isArray(loc?.faqs) ? loc.faqs.map((f) => ({ ...f })) : [],
    examples: Array.isArray(loc?.examples) ? loc.examples.map((e) => ({ ...e })) : undefined,
  };
}

function LanguageTabBar({
  value,
  onChange,
  filledMap,
}: {
  value: AppLanguage;
  onChange: (lang: AppLanguage) => void;
  filledMap?: Partial<Record<AppLanguage, boolean>>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chọn ngôn ngữ nhập liệu"
      className="inline-flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200 rounded-lg"
    >
      {LANG_OPTIONS.map((opt) => {
        const active = value === opt.code;
        const filled = filledMap?.[opt.code];
        return (
          <button
            key={opt.code}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.code)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              active
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="font-mono text-[11px] text-[#2C64AF]">{opt.short}</span>
            <span>{opt.label}</span>
            {filled && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

export function AdminProductsModule({
  products,
  onProductsChanged,
  onOpenPublicProduct,
}: AdminProductsModuleProps) {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [studioTab, setStudioTab] = useState<'general' | 'details' | 'subpages'>('general');

  // Independent language tabs inside each section of Product Admin
  const [generalLang, setGeneralLang] = useState<AppLanguage>('vi');
  const [detailLang, setDetailLang] = useState<AppLanguage>('vi');
  const [subLang, setSubLang] = useState<AppLanguage>('vi');

  // Draft state when editing a product in Studio
  const [draft, setDraft] = useState<ProductItem | null>(null);
  const [draftSubDetails, setDraftSubDetails] = useState<ProductSubDetail[]>([]);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);
  const [newVariantText, setNewVariantText] = useState('');

  // Save & feedback states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState<string | null>(null);
  const [confirmDeleteSubIdx, setConfirmDeleteSubIdx] = useState<number | null>(null);

  // Create Product Modal (with VI | EN | JA tabs)
  const [createOpen, setCreateOpen] = useState(false);
  const [createLang, setCreateLang] = useState<AppLanguage>('vi');
  const [newProdForm, setNewProdForm] = useState({
    sku: '',
    category: 'Giải pháp về không khí trong nhà' as ProductCategory,
    priceVnd: '1500000',
    stock: '10',
    imageKey: 'kirara_cream' as ProductItem['imageKey'],
    isVisible: true,
    names: { vi: '', en: '', ja: '' } as Record<AppLanguage, string>,
    subtitles: { vi: '', en: '', ja: '' } as Record<AppLanguage, string>,
    origins: {
      vi: 'Gensen Global · Nhật Bản',
      en: 'Gensen Global · Japan',
      ja: '株式会社ゲンセン · 日本',
    } as Record<AppLanguage, string>,
  });
  const [creating, setCreating] = useState(false);

  const visibleCount = products.filter((p) => p.isVisible !== false).length;

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const viLoc = resolveProductLocale(p, 'vi');
    const enLoc = resolveProductLocale(p, 'en');
    const jaLoc = resolveProductLocale(p, 'ja');
    return (
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      viLoc.name.toLowerCase().includes(q) ||
      enLoc.name.toLowerCase().includes(q) ||
      jaLoc.name.toLowerCase().includes(q)
    );
  });

  function openProductStudio(
    prod: ProductItem,
    initialTab: 'general' | 'details' | 'subpages' = 'general'
  ) {
    const viLoc = resolveProductLocale(prod, 'vi');
    const enLoc = resolveProductLocale(prod, 'en');
    const jaLoc = resolveProductLocale(prod, 'ja');

    const hydratedTranslations: Required<ProductTranslations> = {
      vi: {
        name: viLoc.name,
        subtitle: viLoc.subtitle,
        category: viLoc.category,
        stockLabel: viLoc.stockLabel,
        origin: viLoc.origin,
        summary: viLoc.summary,
        variants: [...viLoc.variants],
        highlights: [...viLoc.highlights],
        specs: viLoc.specs.map((sp) => ({ ...sp })),
      },
      en: {
        name: prod.translations?.en?.name ?? enLoc.name,
        subtitle: prod.translations?.en?.subtitle ?? enLoc.subtitle,
        category: prod.translations?.en?.category ?? enLoc.category,
        stockLabel: prod.translations?.en?.stockLabel ?? enLoc.stockLabel,
        origin: prod.translations?.en?.origin ?? enLoc.origin,
        summary: prod.translations?.en?.summary ?? enLoc.summary,
        variants: prod.translations?.en?.variants
          ? [...prod.translations.en.variants]
          : [...enLoc.variants],
        highlights: prod.translations?.en?.highlights
          ? [...prod.translations.en.highlights]
          : [...enLoc.highlights],
        specs: prod.translations?.en?.specs
          ? prod.translations.en.specs.map((sp) => ({ ...sp }))
          : enLoc.specs.map((sp) => ({ ...sp })),
      },
      ja: {
        name: prod.translations?.ja?.name ?? jaLoc.name,
        subtitle: prod.translations?.ja?.subtitle ?? jaLoc.subtitle,
        category: prod.translations?.ja?.category ?? jaLoc.category,
        stockLabel: prod.translations?.ja?.stockLabel ?? jaLoc.stockLabel,
        origin: prod.translations?.ja?.origin ?? jaLoc.origin,
        summary: prod.translations?.ja?.summary ?? jaLoc.summary,
        variants: prod.translations?.ja?.variants
          ? [...prod.translations.ja.variants]
          : [...jaLoc.variants],
        highlights: prod.translations?.ja?.highlights
          ? [...prod.translations.ja.highlights]
          : [...jaLoc.highlights],
        specs: prod.translations?.ja?.specs
          ? prod.translations.ja.specs.map((sp) => ({ ...sp }))
          : jaLoc.specs.map((sp) => ({ ...sp })),
      },
    };

    const resolvedSubs = getResolvedSubDetails(prod, false).map((s) => ({
      ...s,
      isVisible: s.isVisible !== false,
      vi: cloneSubLocale(s.vi),
      en: cloneSubLocale(s.en),
      ja: cloneSubLocale(s.ja),
    }));

    setSelectedProductId(prod.id);
    setDraft({
      ...prod,
      isVisible: prod.isVisible !== false,
      variants: [...viLoc.variants],
      highlights: [...viLoc.highlights],
      specs: viLoc.specs.map((sp) => ({ ...sp })),
      translations: hydratedTranslations,
    });
    setDraftSubDetails(resolvedSubs);
    setStudioTab(initialTab);
    setGeneralLang('vi');
    setDetailLang('vi');
    setSubLang('vi');
    setActiveSubIndex(resolvedSubs.length > 0 ? 0 : null);
    setNewVariantText('');
    setSaveSuccess('');
    setSaveError('');
    setConfirmDeleteSubIdx(null);
  }

  function getDraftLocale(targetLang: AppLanguage): Required<LocalizedProductContent> {
    if (!draft) {
      return {
        name: '',
        subtitle: '',
        category: '',
        stockLabel: '',
        origin: '',
        summary: '',
        variants: [],
        highlights: [],
        specs: [],
      };
    }
    const baseVi: LocalizedProductContent = draft.translations?.vi || {
      name: draft.name,
      subtitle: draft.subtitle,
      category: draft.category,
      stockLabel: draft.stockLabel,
      origin: draft.origin,
      summary: draft.summary,
      variants: draft.variants,
      highlights: draft.highlights,
      specs: draft.specs,
    };
    const slot = targetLang === 'vi' ? baseVi : draft.translations?.[targetLang] || {};
    return {
      name: slot.name ?? (targetLang === 'vi' ? draft.name : ''),
      subtitle: slot.subtitle ?? (targetLang === 'vi' ? draft.subtitle : ''),
      category:
        slot.category ??
        (targetLang === 'en'
          ? PRODUCT_CATEGORY_EN[draft.category] || draft.category
          : targetLang === 'ja'
          ? PRODUCT_CATEGORY_JA[draft.category] || draft.category
          : draft.category),
      stockLabel: slot.stockLabel ?? (targetLang === 'vi' ? draft.stockLabel : ''),
      origin: slot.origin ?? (targetLang === 'vi' ? draft.origin : ''),
      summary: slot.summary ?? (targetLang === 'vi' ? draft.summary : ''),
      variants: Array.isArray(slot.variants)
        ? slot.variants
        : targetLang === 'vi'
        ? draft.variants
        : [],
      highlights: Array.isArray(slot.highlights)
        ? slot.highlights
        : targetLang === 'vi'
        ? draft.highlights
        : [],
      specs: Array.isArray(slot.specs)
        ? slot.specs
        : targetLang === 'vi'
        ? draft.specs
        : [],
    };
  }

  function updateDraftLocale(
    targetLang: AppLanguage,
    updater: (cur: Required<LocalizedProductContent>) => Partial<LocalizedProductContent>
  ) {
    setDraft((prev) => {
      if (!prev) return prev;
      const curLoc: Required<LocalizedProductContent> = {
        name:
          targetLang === 'vi'
            ? prev.translations?.vi?.name ?? prev.name
            : prev.translations?.[targetLang]?.name ?? '',
        subtitle:
          targetLang === 'vi'
            ? prev.translations?.vi?.subtitle ?? prev.subtitle
            : prev.translations?.[targetLang]?.subtitle ?? '',
        category:
          prev.translations?.[targetLang]?.category ??
          (targetLang === 'en'
            ? PRODUCT_CATEGORY_EN[prev.category] || prev.category
            : targetLang === 'ja'
            ? PRODUCT_CATEGORY_JA[prev.category] || prev.category
            : prev.category),
        stockLabel:
          targetLang === 'vi'
            ? prev.translations?.vi?.stockLabel ?? prev.stockLabel
            : prev.translations?.[targetLang]?.stockLabel ?? '',
        origin:
          targetLang === 'vi'
            ? prev.translations?.vi?.origin ?? prev.origin
            : prev.translations?.[targetLang]?.origin ?? '',
        summary:
          targetLang === 'vi'
            ? prev.translations?.vi?.summary ?? prev.summary
            : prev.translations?.[targetLang]?.summary ?? '',
        variants:
          targetLang === 'vi'
            ? prev.translations?.vi?.variants ?? prev.variants
            : prev.translations?.[targetLang]?.variants ?? [],
        highlights:
          targetLang === 'vi'
            ? prev.translations?.vi?.highlights ?? prev.highlights
            : prev.translations?.[targetLang]?.highlights ?? [],
        specs:
          targetLang === 'vi'
            ? prev.translations?.vi?.specs ?? prev.specs
            : prev.translations?.[targetLang]?.specs ?? [],
      };

      const patch = updater(curLoc);
      const nextLoc: LocalizedProductContent = { ...curLoc, ...patch };
      const nextTranslations: ProductTranslations = {
        ...(prev.translations || {}),
        [targetLang]: nextLoc,
      };

      if (targetLang === 'vi') {
        return {
          ...prev,
          name: nextLoc.name ?? prev.name,
          subtitle: nextLoc.subtitle ?? prev.subtitle,
          stockLabel: nextLoc.stockLabel ?? prev.stockLabel,
          origin: nextLoc.origin ?? prev.origin,
          summary: nextLoc.summary ?? prev.summary,
          variants: nextLoc.variants ?? prev.variants,
          highlights: nextLoc.highlights ?? prev.highlights,
          specs: nextLoc.specs ?? prev.specs,
          translations: nextTranslations,
        };
      }

      return {
        ...prev,
        translations: nextTranslations,
      };
    });
  }

  async function handleQuickToggleVisibility(prod: ProductItem) {
    const nextVisible = prod.isVisible === false;
    const res = await fetch(`/api/products/${prod.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: nextVisible }),
    });
    if (res.ok) {
      await onProductsChanged();
      if (draft && draft.id === prod.id) {
        setDraft({ ...draft, isVisible: nextVisible });
      }
    }
  }

  async function handleDeleteProduct(id: string) {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDeleteProdId(null);
      if (selectedProductId === id) {
        setSelectedProductId(null);
        setDraft(null);
      }
      await onProductsChanged();
    }
  }

  async function handleCreateProduct(e: FormEvent) {
    e.preventDefault();
    const viName = newProdForm.names.vi.trim() || newProdForm.names.en.trim() || newProdForm.names.ja.trim();
    if (!viName) return;

    const enName = newProdForm.names.en.trim() || viName;
    const jaName = newProdForm.names.ja.trim() || viName;
    const viSub = newProdForm.subtitles.vi.trim();
    const enSub = newProdForm.subtitles.en.trim() || viSub;
    const jaSub = newProdForm.subtitles.ja.trim() || viSub;

    setCreating(true);
    try {
      const priceNum = Math.max(0, Number(newProdForm.priceVnd) || 0);
      const priceLabel = `${priceNum.toLocaleString('vi-VN')} VNĐ`;
      const starterSubs = createStarterSubDetails(viName, priceLabel, enName, jaName);

      const translations: ProductTranslations = {
        vi: {
          name: viName,
          subtitle: viSub,
          category: newProdForm.category,
          origin: newProdForm.origins.vi.trim() || 'Gensen Global · Nhật Bản',
        },
        en: {
          name: enName,
          subtitle: enSub,
          category: PRODUCT_CATEGORY_EN[newProdForm.category] || newProdForm.category,
          origin: newProdForm.origins.en.trim() || 'Gensen Global · Japan',
        },
        ja: {
          name: jaName,
          subtitle: jaSub,
          category: PRODUCT_CATEGORY_JA[newProdForm.category] || newProdForm.category,
          origin: newProdForm.origins.ja.trim() || '株式会社ゲンセン · 日本',
        },
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: viName,
          sku: newProdForm.sku.trim(),
          category: newProdForm.category,
          priceVnd: priceNum,
          stock: Math.max(0, Number(newProdForm.stock) || 0),
          subtitle: viSub,
          origin: newProdForm.origins.vi.trim(),
          imageKey: newProdForm.imageKey,
          isVisible: newProdForm.isVisible,
          translations,
          subDetails: starterSubs,
        }),
      });
      if (res.ok) {
        const created = (await res.json()) as ProductItem;
        setCreateOpen(false);
        setCreateLang('vi');
        setNewProdForm({
          sku: '',
          category: 'Giải pháp về không khí trong nhà',
          priceVnd: '1500000',
          stock: '10',
          imageKey: 'kirara_cream',
          isVisible: true,
          names: { vi: '', en: '', ja: '' },
          subtitles: { vi: '', en: '', ja: '' },
          origins: {
            vi: 'Gensen Global · Nhật Bản',
            en: 'Gensen Global · Japan',
            ja: '株式会社ゲンセン · 日本',
          },
        });
        await onProductsChanged();
        openProductStudio(created, 'details');
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveStudio() {
    if (!draft) return;
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const cleanBlock = (l: AppLanguage): LocalizedProductContent => {
        const loc = getDraftLocale(l);
        return {
          name: loc.name.trim(),
          subtitle: loc.subtitle.trim(),
          category: loc.category.trim(),
          stockLabel: loc.stockLabel.trim(),
          origin: loc.origin.trim(),
          summary: loc.summary.trim(),
          variants: loc.variants.map((v) => v.trim()).filter(Boolean),
          highlights: loc.highlights.map((h) => h.trim()).filter(Boolean),
          specs: loc.specs
            .map((sp) => ({ label: sp.label.trim(), value: sp.value.trim() }))
            .filter((sp) => sp.label && sp.value),
        };
      };

      const cleanVi = cleanBlock('vi');
      const cleanTranslations: ProductTranslations = {
        vi: cleanVi,
        en: cleanBlock('en'),
        ja: cleanBlock('ja'),
      };

      const res = await fetch(`/api/products/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: draft.sku,
          name: cleanVi.name || draft.name,
          subtitle: cleanVi.subtitle ?? draft.subtitle,
          category: draft.category,
          priceVnd: Math.max(0, Number(draft.priceVnd) || 0),
          stock: Math.max(0, Number(draft.stock) || 0),
          stockLabel: cleanVi.stockLabel ?? draft.stockLabel,
          variants: cleanVi.variants || [],
          origin: cleanVi.origin ?? draft.origin,
          summary: cleanVi.summary ?? draft.summary,
          highlights: cleanVi.highlights || [],
          specs: cleanVi.specs || [],
          imageKey: draft.imageKey,
          featured: Boolean(draft.featured),
          isVisible: draft.isVisible !== false,
          translations: cleanTranslations,
          subDetails: draftSubDetails,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSaveError(err.error || 'Không thể lưu thay đổi.');
        return;
      }
      await onProductsChanged();
      setSaveSuccess(
        lang === 'ja'
          ? '多言語設定と製品情報を保存しました！'
          : lang === 'en'
          ? 'Multilingual product settings saved to website!'
          : 'Đã lưu cài đặt đa ngôn ngữ & cập nhật lên website!'
      );
      setTimeout(() => setSaveSuccess(''), 3500);
    } catch {
      setSaveError('Lỗi kết nối máy chủ.');
    } finally {
      setSaving(false);
    }
  }

  // --- Sub-detail helper mutations (multilingual VI / EN / JA) ---
  function updateActiveSub(updater: (current: ProductSubDetail) => ProductSubDetail) {
    if (activeSubIndex === null) return;
    setDraftSubDetails((prev) =>
      prev.map((item, idx) => (idx === activeSubIndex ? updater(item) : item))
    );
  }

  function getSubLocaleData(sub: ProductSubDetail, targetLang: AppLanguage): ProductSubDetailLocale {
    if (targetLang === 'vi') return sub.vi;
    if (targetLang === 'en') {
      return (
        sub.en || {
          cardTitle: '',
          pageTitle: '',
          eyebrow: '',
          lead: '',
          sections: [],
          metrics: [],
          comparisonHeaders: ['Item', 'Specification'],
          comparisonRows: [],
          faqs: [],
        }
      );
    }
    return sub.ja;
  }

  function updateActiveSubLocale(
    targetLang: AppLanguage,
    updater: (loc: ProductSubDetailLocale) => ProductSubDetailLocale
  ) {
    updateActiveSub((cur) => {
      const currentLoc = getSubLocaleData(cur, targetLang);
      const nextLoc = updater(currentLoc);
      return {
        ...cur,
        [targetLang]: nextLoc,
      };
    });
  }

  function handleAddSubPage() {
    if (!draft) return;
    const count = draftSubDetails.length + 1;
    const viName = getDraftLocale('vi').name || draft.name;
    const enName = getDraftLocale('en').name || viName;
    const jaName = getDraftLocale('ja').name || viName;

    const newSub: ProductSubDetail = {
      slug: `chuyen-muc-${Date.now().toString().slice(-4)}`,
      imageKey: 'hero_living',
      kind: 'editorial',
      isVisible: true,
      vi: {
        cardTitle: `Trang con mới ${count}`,
        pageTitle: `Chi tiết tính năng — ${viName}`,
        eyebrow: `${String(count).padStart(2, '0')} · Thông tin chuyên sâu`,
        lead: 'Mô tả ngắn gọn giúp khách hàng nắm bắt nhanh giá trị của chuyên mục này.',
        sections: [
          {
            heading: 'Nội dung chi tiết',
            body: 'Nhập mô tả kỹ thuật, quy trình hoặc lợi ích nổi bật dành cho khách hàng và đối tác.',
            bullets: ['Điểm nổi bật thứ nhất', 'Điểm nổi bật thứ hai'],
          },
        ],
        metrics: [],
        comparisonHeaders: ['Hạng mục', 'Thông số chi tiết'],
        comparisonRows: [],
        faqs: [],
      },
      en: {
        cardTitle: `New Sub-Page ${count}`,
        pageTitle: `Feature Details — ${enName}`,
        eyebrow: `${String(count).padStart(2, '0')} · Technical Spotlight`,
        lead: 'Concise overview helping customers and partners grasp the core value of this section.',
        sections: [
          {
            heading: 'Detailed Overview',
            body: 'Enter technical specifications, application guidelines, or customer benefits.',
            bullets: ['Key highlight one', 'Key highlight two'],
          },
        ],
        metrics: [],
        comparisonHeaders: ['Item', 'Specification'],
        comparisonRows: [],
        faqs: [],
      },
      ja: {
        cardTitle: `詳細ページ ${count}`,
        pageTitle: `${jaName} — 詳細情報`,
        eyebrow: `${String(count).padStart(2, '0')} · 詳細コンテンツ`,
        lead: 'この機能・特性の概要説明。',
        sections: [
          {
            heading: '詳細ポイント',
            body: '特徴や仕様について詳しく記載します。',
            bullets: ['特徴 1', '特徴 2'],
          },
        ],
        metrics: [],
        comparisonHeaders: ['項目', '仕様詳細'],
        comparisonRows: [],
        faqs: [],
      },
    };
    setDraftSubDetails((prev) => [...prev, newSub]);
    setActiveSubIndex(draftSubDetails.length);
  }

  function moveSubPage(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= draftSubDetails.length) return;
    setDraftSubDetails((prev) => {
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return next;
    });
    if (activeSubIndex === idx) setActiveSubIndex(target);
    else if (activeSubIndex === target) setActiveSubIndex(idx);
  }

  function toggleSubVisibility(idx: number) {
    setDraftSubDetails((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, isVisible: item.isVisible === false } : item
      )
    );
  }

  function deleteSubPage(idx: number) {
    setDraftSubDetails((prev) => prev.filter((_, i) => i !== idx));
    setConfirmDeleteSubIdx(null);
    if (activeSubIndex === idx) {
      setActiveSubIndex(draftSubDetails.length > 1 ? 0 : null);
    } else if (activeSubIndex !== null && activeSubIndex > idx) {
      setActiveSubIndex(activeSubIndex - 1);
    }
  }

  const activeSub =
    activeSubIndex !== null && draftSubDetails[activeSubIndex]
      ? draftSubDetails[activeSubIndex]
      : null;

  // =========================================================================
  // VIEW B: PRODUCT STUDIO EDITOR
  // =========================================================================
  if (draft) {
    const generalData = getDraftLocale(generalLang);
    const detailData = getDraftLocale(detailLang);

    const generalFilledMap: Record<AppLanguage, boolean> = {
      vi: Boolean(getDraftLocale('vi').name.trim()),
      en: Boolean(getDraftLocale('en').name.trim()),
      ja: Boolean(getDraftLocale('ja').name.trim()),
    };

    const detailFilledMap: Record<AppLanguage, boolean> = {
      vi: Boolean(getDraftLocale('vi').summary.trim() || getDraftLocale('vi').specs.length > 0),
      en: Boolean(getDraftLocale('en').summary.trim() || getDraftLocale('en').specs.length > 0),
      ja: Boolean(getDraftLocale('ja').summary.trim() || getDraftLocale('ja').specs.length > 0),
    };

    const activeSubLoc = activeSub ? getSubLocaleData(activeSub, subLang) : null;
    const subFilledMap: Record<AppLanguage, boolean> | undefined = activeSub
      ? {
          vi: Boolean(activeSub.vi?.cardTitle?.trim()),
          en: Boolean(activeSub.en?.cardTitle?.trim()),
          ja: Boolean(activeSub.ja?.cardTitle?.trim()),
        }
      : undefined;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="space-y-6"
      >
        {/* Studio Top Action Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setSelectedProductId(null);
                setDraft(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
            <div className="min-w-0">
              <div className="font-mono text-[11px] text-slate-500 truncate">{draft.sku}</div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {getDraftLocale('vi').name || draft.name}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Public Website Visibility Toggle */}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, isVisible: draft.isVisible === false })}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                draft.isVisible !== false
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {draft.isVisible !== false ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Đang hiện trên Website</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Đang ẩn khỏi Website</span>
                </>
              )}
            </button>

            {onOpenPublicProduct && (
              <button
                type="button"
                onClick={() => onOpenPublicProduct(draft.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-[#2C64AF] hover:text-[#2C64AF] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem trang web</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveStudio}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Đang lưu...' : 'Lưu cài đặt'}</span>
            </button>
          </div>
        </div>

        {/* Save Feedback Banner */}
        {(saveSuccess || saveError) && (
          <div
            className={`px-4 py-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
              saveSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccess || saveError}</span>
          </div>
        )}

        {/* 3 Clean Studio Section Tabs */}
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl">
          <button
            type="button"
            onClick={() => setStudioTab('general')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              studioTab === 'general'
                ? 'bg-[#2C64AF] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Thông tin & Giá bán
          </button>
          <button
            type="button"
            onClick={() => setStudioTab('details')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              studioTab === 'details'
                ? 'bg-[#2C64AF] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Chi tiết & Thông số ({detailData.specs.length})
          </button>
          <button
            type="button"
            onClick={() => setStudioTab('subpages')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              studioTab === 'subpages'
                ? 'bg-[#2C64AF] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Trang con sản phẩm ({draftSubDetails.length})
          </button>
        </div>

        {/* =====================================================================
            TAB 1: GENERAL, VISIBILITY, PRICING & MULTILINGUAL IDENTITY
            ===================================================================== */}
        {studioTab === 'general' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {/* Shared Commerce Fields (SKU, Category key, Price, Stock) */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-500">
                Thông số dùng chung toàn website (Mã SKU, Danh mục gốc, Đơn giá, Tồn kho)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mã sản phẩm (SKU)
                  </label>
                  <input
                    type="text"
                    value={draft.sku}
                    onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Danh mục phân loại
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) => {
                      const nextCat = e.target.value as ProductCategory;
                      setDraft((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          category: nextCat,
                          translations: {
                            ...(prev.translations || {}),
                            vi: { ...(prev.translations?.vi || {}), category: nextCat },
                            en: {
                              ...(prev.translations?.en || {}),
                              category: PRODUCT_CATEGORY_EN[nextCat] || nextCat,
                            },
                            ja: {
                              ...(prev.translations?.ja || {}),
                              category: PRODUCT_CATEGORY_JA[nextCat] || nextCat,
                            },
                          },
                        };
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#2C64AF]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Đơn giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={draft.priceVnd}
                    onChange={(e) => {
                      const num = Math.max(0, Number(e.target.value) || 0);
                      setDraft({
                        ...draft,
                        priceVnd: num,
                        priceLabel: `${num.toLocaleString('vi-VN')} VNĐ`,
                      });
                    }}
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tồn kho thực tế
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={draft.stock}
                    onChange={(e) =>
                      setDraft({ ...draft, stock: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono tabular-nums border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
              </div>
            </div>

            {/* Multilingual General Properties Tabbed Block */}
            <div className="pt-5 border-t border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Globe className="w-4 h-4 text-[#2C64AF]" />
                  <span>Thông tin hiển thị theo ngôn ngữ</span>
                </div>
                <LanguageTabBar
                  value={generalLang}
                  onChange={(nextL) => {
                    setGeneralLang(nextL);
                    setNewVariantText('');
                  }}
                  filledMap={generalFilledMap}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên sản phẩm ({generalLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    value={generalData.name}
                    onChange={(e) =>
                      updateDraftLocale(generalLang, () => ({ name: e.target.value }))
                    }
                    placeholder={
                      generalLang === 'en'
                        ? 'English product name...'
                        : generalLang === 'ja'
                        ? '日本語の製品名...'
                        : 'Tên sản phẩm tiếng Việt...'
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên danh mục hiển thị ({generalLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={generalData.category}
                    onChange={(e) =>
                      updateDraftLocale(generalLang, () => ({ category: e.target.value }))
                    }
                    placeholder={
                      generalLang === 'en'
                        ? 'e.g. Indoor Air Solutions'
                        : generalLang === 'ja'
                        ? '例: 室内空気ソリューション'
                        : 'VD: Giải pháp về không khí trong nhà'
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nhãn tình trạng kho ({generalLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={generalData.stockLabel}
                    onChange={(e) =>
                      updateDraftLocale(generalLang, () => ({ stockLabel: e.target.value }))
                    }
                    placeholder={
                      generalLang === 'en'
                        ? 'e.g. In Stock · Ready to Ship'
                        : generalLang === 'ja'
                        ? '例: 在庫あり・即納可'
                        : 'VD: Sẵn kho & thi công'
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Xuất xứ / Nhà sản xuất ({generalLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={generalData.origin}
                    onChange={(e) =>
                      updateDraftLocale(generalLang, () => ({ origin: e.target.value }))
                    }
                    placeholder={
                      generalLang === 'en'
                        ? 'e.g. Gensen Co., Ltd. · Japan'
                        : generalLang === 'ja'
                        ? '例: 株式会社ゲンセン · 日本'
                        : 'VD: Công ty TNHH Gensen · Nhật Bản'
                    }
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
              </div>

              {/* Variants Builder per Language */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Quy cách / Dung tích hiển thị cho khách ({generalLang.toUpperCase()})
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {generalData.variants.map((v, i) => (
                    <span
                      key={`${generalLang}-${v}-${i}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-medium text-slate-800"
                    >
                      <span>{v}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraftLocale(generalLang, (cur) => ({
                            variants: cur.variants.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {generalData.variants.length === 0 && (
                    <span className="text-xs text-slate-400">
                      Chưa có quy cách riêng cho ngôn ngữ này (sẽ dùng mặc định từ Tiếng Việt nếu để trống).
                    </span>
                  )}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newVariantText}
                    onChange={(e) => setNewVariantText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newVariantText.trim()) {
                          const val = newVariantText.trim();
                          updateDraftLocale(generalLang, (cur) => ({
                            variants: [...cur.variants, val],
                          }));
                          setNewVariantText('');
                        }
                      }
                    }}
                    placeholder={
                      generalLang === 'en'
                        ? 'Add option (e.g. 19L Standard Pail)...'
                        : generalLang === 'ja'
                        ? '仕様を追加 (例: 19L標準缶)...'
                        : 'Thêm quy cách (VD: Thùng 10L)...'
                    }
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newVariantText.trim()) {
                        const val = newVariantText.trim();
                        updateDraftLocale(generalLang, (cur) => ({
                          variants: [...cur.variants, val],
                        }));
                        setNewVariantText('');
                      }
                    }}
                    className="px-3.5 py-2 text-xs font-semibold text-[#2C64AF] bg-[#EFF6FF] border border-[#2C64AF]/20 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    + Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Product Image Picker */}
            <div className="pt-5 border-t border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Hình ảnh đại diện sản phẩm
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {PRODUCT_IMAGE_CHOICES.map((choice) => {
                  const selected = draft.imageKey === choice.key;
                  return (
                    <button
                      key={choice.key}
                      type="button"
                      onClick={() => setDraft({ ...draft, imageKey: choice.key })}
                      className={`group text-left rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        selected
                          ? 'border-[#2C64AF] ring-2 ring-[#2C64AF]/25'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                        <ImageWithFallback
                          src={PRODUCT_IMAGES[choice.key]}
                          alt={choice.label}
                          className="w-full h-full object-cover"
                        />
                        {selected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2C64AF] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-[11px] font-medium text-slate-700 line-clamp-1">
                        {choice.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Flags */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2.5 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.isVisible !== false}
                  onChange={(e) => setDraft({ ...draft, isVisible: e.target.checked })}
                  className="w-4 h-4 accent-[#2C64AF] rounded"
                />
                <span>Cho phép xuất hiện trên trang chủ & danh mục công khai</span>
              </label>
              <label className="inline-flex items-center gap-2.5 text-sm text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(draft.featured)}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#2C64AF] rounded"
                />
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2C64AF]" />
                  Đánh dấu sản phẩm chủ lực (Featured)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: PRODUCT DETAIL SETTINGS (SUBTITLE, SUMMARY, HIGHLIGHTS, SPECS)
            ===================================================================== */}
        {studioTab === 'details' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {/* Per-Section Language Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Nội dung trang chi tiết sản phẩm ({detailLang.toUpperCase()})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chuyển tab Tiếng Việt, English hoặc 日本語 để thiết lập tiêu đề phụ, mô tả, ưu điểm và bảng thông số riêng cho từng ngôn ngữ.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {detailLang !== 'vi' && (
                  <button
                    type="button"
                    onClick={() => {
                      const viBlock = getDraftLocale('vi');
                      updateDraftLocale(detailLang, () => ({
                        subtitle: detailData.subtitle || viBlock.subtitle,
                        summary: detailData.summary || viBlock.summary,
                        highlights:
                          detailData.highlights.length > 0
                            ? detailData.highlights
                            : [...viBlock.highlights],
                        specs:
                          detailData.specs.length > 0
                            ? detailData.specs
                            : viBlock.specs.map((sp) => ({ ...sp })),
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-[#F8FAFC] border border-slate-200 hover:border-[#2C64AF] hover:text-[#2C64AF] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Điền khung từ Tiếng Việt</span>
                  </button>
                )}
                <LanguageTabBar
                  value={detailLang}
                  onChange={setDetailLang}
                  filledMap={detailFilledMap}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tiêu đề phụ — Subtitle ({detailLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={detailData.subtitle}
                onChange={(e) =>
                  updateDraftLocale(detailLang, () => ({ subtitle: e.target.value }))
                }
                placeholder={
                  detailLang === 'en'
                    ? 'Short English tagline under product title...'
                    : detailLang === 'ja'
                    ? '製品名の直下に表示されるサブタイトル...'
                    : 'Mô tả 1 dòng hiển thị ngay dưới tên sản phẩm...'
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mô tả chi tiết sản phẩm ({detailLang.toUpperCase()})
              </label>
              <textarea
                rows={4}
                value={detailData.summary}
                onChange={(e) =>
                  updateDraftLocale(detailLang, () => ({ summary: e.target.value }))
                }
                placeholder={
                  detailLang === 'en'
                    ? 'Detailed English description shown on product detail page...'
                    : detailLang === 'ja'
                    ? '製品詳細ページに表示される日本語の説明文...'
                    : 'Mô tả chi tiết công dụng, thành phần và ứng dụng của sản phẩm...'
                }
                className="w-full px-3.5 py-2.5 text-sm leading-relaxed border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
              />
            </div>

            {/* Highlights List per Language */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Ưu điểm nổi bật ({detailLang.toUpperCase()}) — {detailData.highlights.length} mục
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateDraftLocale(detailLang, (cur) => ({
                      highlights: [...cur.highlights, ''],
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm ưu điểm</span>
                </button>
              </div>
              <div className="space-y-2">
                {detailData.highlights.map((hl, idx) => (
                  <div key={`${detailLang}-hl-${idx}`} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraftLocale(detailLang, (cur) => ({
                          highlights: cur.highlights.map((item, i) => (i === idx ? val : item)),
                        }));
                      }}
                      placeholder={`Ưu điểm ${idx + 1} (${detailLang.toUpperCase()})...`}
                      className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftLocale(detailLang, (cur) => ({
                          highlights: cur.highlights.filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {detailData.highlights.length === 0 && (
                  <p className="text-xs text-slate-400 py-2">
                    Chưa có ưu điểm riêng cho ngôn ngữ này. Nhấn &quot;Thêm ưu điểm&quot; hoặc &quot;Điền khung từ Tiếng Việt&quot;.
                  </p>
                )}
              </div>
            </div>

            {/* Technical Specs Pairs per Language */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Bảng thông số kỹ thuật ({detailLang.toUpperCase()}) — {detailData.specs.length} dòng
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateDraftLocale(detailLang, (cur) => ({
                      specs: [...cur.specs, { label: '', value: '' }],
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm dòng thông số</span>
                </button>
              </div>
              <div className="space-y-2.5">
                {detailData.specs.map((sp, idx) => (
                  <div
                    key={`${detailLang}-sp-${idx}`}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <input
                      type="text"
                      value={sp.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraftLocale(detailLang, (cur) => ({
                          specs: cur.specs.map((item, i) =>
                            i === idx ? { ...item, label: val } : item
                          ),
                        }));
                      }}
                      placeholder={
                        detailLang === 'en'
                          ? 'Spec label (e.g. Coverage)'
                          : detailLang === 'ja'
                          ? '項目名 (例: 標準施工面積)'
                          : 'Tên thông số (VD: Định mức)'
                      }
                      className="sm:col-span-4 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <input
                      type="text"
                      value={sp.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateDraftLocale(detailLang, (cur) => ({
                          specs: cur.specs.map((item, i) =>
                            i === idx ? { ...item, value: val } : item
                          ),
                        }));
                      }}
                      placeholder="Giá trị chi tiết..."
                      className="sm:col-span-7 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateDraftLocale(detailLang, (cur) => ({
                          specs: cur.specs.filter((_, i) => i !== idx),
                        }))
                      }
                      className="sm:col-span-1 p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg cursor-pointer justify-self-end"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {detailData.specs.length === 0 && (
                  <p className="text-xs text-slate-400 py-2">
                    Chưa có dòng thông số cho ngôn ngữ này. Nhấn &quot;Thêm dòng thông số&quot; để thêm mới.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: SUB-DETAILS (PAGE CON) VISUAL GRID & MULTILINGUAL EDITOR
            ===================================================================== */}
        {studioTab === 'subpages' && (
          <div className="space-y-6">
            {/* Visual Preview Grid matching Public Kirara 3-column Tile Grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Bố cục thẻ trang con ({draftSubDetails.length} thẻ)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn thẻ bất kỳ để sửa nội dung đa ngôn ngữ, đổi ảnh nền, ẩn/hiện hoặc sắp xếp thứ tự.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <LanguageTabBar value={subLang} onChange={setSubLang} />
                  <button
                    type="button"
                    onClick={handleAddSubPage}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm trang con mới</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {draftSubDetails.map((sub, idx) => {
                    const isSelected = activeSubIndex === idx;
                    const isHidden = sub.isVisible === false;
                    const locPreview = getSubLocaleData(sub, subLang);
                    const displayTitle = locPreview.cardTitle || sub.vi.cardTitle;
                    const isFallbackPreview = !locPreview.cardTitle && subLang !== 'vi';

                    return (
                      <div
                        key={sub.slug + idx}
                        className={`group relative rounded-lg overflow-hidden border transition-all ${
                          isSelected
                            ? 'ring-2 ring-[#2C64AF] border-[#2C64AF]'
                            : 'border-slate-200 hover:border-slate-300'
                        } ${isHidden ? 'opacity-55' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSubIndex(idx);
                            setConfirmDeleteSubIdx(null);
                          }}
                          className="relative block aspect-[16/10] w-full bg-slate-900 text-center cursor-pointer"
                        >
                          <ImageWithFallback
                            src={ARTICLE_IMAGES[sub.imageKey]}
                            alt={displayTitle}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/55 to-slate-950/65" />
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-3 gap-1">
                            <span className="font-serif text-sm font-medium text-white text-center leading-snug drop-shadow">
                              {displayTitle}
                            </span>
                            {isFallbackPreview && (
                              <span className="text-[10px] font-mono text-amber-200">
                                Chưa nhập {subLang.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Clean compact control bar under card */}
                        <div className="bg-white px-2.5 py-1.5 border-t border-slate-200 flex items-center justify-between gap-1 text-[11px]">
                          <span className="font-mono text-slate-400 tabular-nums">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveSubPage(idx, -1)}
                              disabled={idx === 0}
                              title="Đưa lên trước"
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSubPage(idx, 1)}
                              disabled={idx === draftSubDetails.length - 1}
                              title="Đưa xuống sau"
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSubVisibility(idx)}
                              title={isHidden ? 'Hiện thẻ này' : 'Ẩn thẻ này'}
                              className={`p-1 rounded cursor-pointer ${
                                isHidden
                                  ? 'text-slate-400 hover:text-emerald-700'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {isHidden ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quick Add Card Slot */}
                  <button
                    type="button"
                    onClick={handleAddSubPage}
                    className="aspect-[16/10] w-full rounded-lg border-2 border-dashed border-slate-300 hover:border-[#2C64AF] bg-white/70 hover:bg-white flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-[#2C64AF] transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-semibold">Thêm trang con</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Sub-Page Detailed Multilingual Editor */}
            {activeSub && activeSubIndex !== null && activeSubLoc && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="font-mono text-xs text-[#2C64AF] font-semibold">
                      Đang sửa trang con #{String(activeSubIndex + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {activeSubLoc.cardTitle || activeSub.vi.cardTitle}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleSubVisibility(activeSubIndex)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer whitespace-nowrap shrink-0 ${
                        activeSub.isVisible !== false
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {activeSub.isVisible !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Đang hiển thị</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Đang ẩn</span>
                        </>
                      )}
                    </button>

                    {confirmDeleteSubIdx === activeSubIndex ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => deleteSubPage(activeSubIndex)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg cursor-pointer"
                        >
                          Xác nhận xóa
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteSubIdx(null)}
                          className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteSubIdx(activeSubIndex)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-slate-200 hover:bg-red-50 rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa trang con</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Shared Sub-Page Settings: Type & Background Photo */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-5 border-b border-slate-200">
                  <div className="lg:col-span-4 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Loại trang con (dùng chung)
                    </label>
                    <select
                      value={activeSub.kind}
                      onChange={(e) =>
                        updateActiveSub((cur) => ({
                          ...cur,
                          kind: e.target.value as ProductSubDetail['kind'],
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="editorial">Bài viết chuyên sâu</option>
                      <option value="order">Đặt hàng trực tuyến (Online Shop)</option>
                      <option value="inquiry">Form liên hệ tư vấn (Inquiry)</option>
                    </select>
                  </div>

                  <div className="lg:col-span-8">
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Ảnh nền thẻ trang con
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {SUB_IMAGE_CHOICES.map((ch) => {
                        const active = activeSub.imageKey === ch.key;
                        return (
                          <button
                            key={ch.key}
                            type="button"
                            onClick={() =>
                              updateActiveSub((cur) => ({ ...cur, imageKey: ch.key }))
                            }
                            className={`rounded-lg overflow-hidden border text-left cursor-pointer ${
                              active
                                ? 'border-[#2C64AF] ring-2 ring-[#2C64AF]/25'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="aspect-[16/10] bg-slate-100 relative">
                              <ImageWithFallback
                                src={ARTICLE_IMAGES[ch.key]}
                                alt={ch.label}
                                className="w-full h-full object-cover"
                              />
                              {active && (
                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2C64AF] text-white flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>
                            <div className="p-1.5 text-[11px] font-medium text-slate-700 truncate">
                              {ch.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Language Switcher inside Active Sub-Page Editor */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <Globe className="w-4 h-4 text-[#2C64AF]" />
                    <span>Nội dung trang con ({subLang.toUpperCase()})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {subLang !== 'vi' && (
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveSubLocale(subLang, (cur) => ({
                            cardTitle: cur.cardTitle || activeSub.vi.cardTitle,
                            pageTitle: cur.pageTitle || activeSub.vi.pageTitle,
                            eyebrow: cur.eyebrow || activeSub.vi.eyebrow,
                            lead: cur.lead || activeSub.vi.lead,
                            sections:
                              cur.sections.length > 0
                                ? cur.sections
                                : activeSub.vi.sections.map((sec) => ({
                                    ...sec,
                                    bullets: sec.bullets ? [...sec.bullets] : [],
                                  })),
                            metrics:
                              cur.metrics && cur.metrics.length > 0
                                ? cur.metrics
                                : (activeSub.vi.metrics || []).map((m) => ({ ...m })),
                            comparisonHeaders:
                              cur.comparisonHeaders || activeSub.vi.comparisonHeaders,
                            comparisonRows:
                              cur.comparisonRows && cur.comparisonRows.length > 0
                                ? cur.comparisonRows
                                : (activeSub.vi.comparisonRows || []).map((r) => ({ ...r })),
                            faqs:
                              cur.faqs && cur.faqs.length > 0
                                ? cur.faqs
                                : (activeSub.vi.faqs || []).map((f) => ({ ...f })),
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-[#F8FAFC] border border-slate-200 hover:border-[#2C64AF] hover:text-[#2C64AF] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép khung từ Tiếng Việt</span>
                      </button>
                    )}
                    <LanguageTabBar
                      value={subLang}
                      onChange={setSubLang}
                      filledMap={subFilledMap}
                    />
                  </div>
                </div>

                {/* Localized Titles & Eyebrow */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tên trên thẻ ảnh ({subLang.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      value={activeSubLoc.cardTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateActiveSubLocale(subLang, (cur) => ({ ...cur, cardTitle: val }));
                      }}
                      placeholder={
                        subLang === 'en'
                          ? 'English card label...'
                          : subLang === 'ja'
                          ? '日本語カード名...'
                          : 'Tên hiển thị trên thẻ ảnh...'
                      }
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tiêu đề lớn đầu trang ({subLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={activeSubLoc.pageTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateActiveSubLocale(subLang, (cur) => ({ ...cur, pageTitle: val }));
                      }}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhãn phụ Eyebrow ({subLang.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={activeSubLoc.eyebrow}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateActiveSubLocale(subLang, (cur) => ({ ...cur, eyebrow: val }));
                      }}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                  </div>
                </div>

                {/* Lead Paragraph */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đoạn tóm tắt mở đầu Lead ({subLang.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={activeSubLoc.lead}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateActiveSubLocale(subLang, (cur) => ({ ...cur, lead: val }));
                    }}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>

                {/* Sections Builder */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Các phần nội dung chính ({subLang.toUpperCase()}) — {activeSubLoc.sections.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveSubLocale(subLang, (cur) => ({
                          ...cur,
                          sections: [
                            ...cur.sections,
                            {
                              heading:
                                subLang === 'en'
                                  ? 'New Section Heading'
                                  : subLang === 'ja'
                                  ? '新規セクション'
                                  : 'Tiêu đề mục mới',
                              body: '',
                              bullets: [],
                            },
                          ],
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm mục nội dung</span>
                    </button>
                  </div>

                  {activeSubLoc.sections.map((sec: ProductSubDetailSection, sIdx: number) => (
                    <div
                      key={`${subLang}-sec-${sIdx}`}
                      className="p-4 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveSubLocale(subLang, (cur) => ({
                              ...cur,
                              sections: cur.sections.map((item, i) =>
                                i === sIdx ? { ...item, heading: val } : item
                              ),
                            }));
                          }}
                          placeholder="Tiêu đề mục..."
                          className="flex-1 px-3 py-1.5 text-sm font-semibold bg-white border border-slate-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveSubLocale(subLang, (cur) => ({
                              ...cur,
                              sections: cur.sections.filter((_, i) => i !== sIdx),
                            }))
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={sec.body}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            sections: cur.sections.map((item, i) =>
                              i === sIdx ? { ...item, body: val } : item
                            ),
                          }));
                        }}
                        placeholder="Đoạn văn giải thích..."
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                      />
                      <textarea
                        rows={2}
                        value={(sec.bullets || []).join('\n')}
                        onChange={(e) => {
                          const bullets = e.target.value
                            .split('\n')
                            .filter((line) => line.length > 0);
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            sections: cur.sections.map((item, i) =>
                              i === sIdx ? { ...item, bullets } : item
                            ),
                          }));
                        }}
                        placeholder="Danh sách gạch đầu dòng (mỗi dòng 1 ý)..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  ))}
                </div>

                {/* Metrics Builder */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Số liệu nổi bật ({subLang.toUpperCase()}) — {(activeSubLoc.metrics || []).length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveSubLocale(subLang, (cur) => ({
                          ...cur,
                          metrics: [...(cur.metrics || []), { value: '', label: '' }],
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm chỉ số</span>
                    </button>
                  </div>
                  {(activeSubLoc.metrics || []).map((m: ProductSubDetailMetric, mIdx: number) => (
                    <div
                      key={`${subLang}-metric-${mIdx}`}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            metrics: (cur.metrics || []).map((item, i) =>
                              i === mIdx ? { ...item, value: val } : item
                            ),
                          }));
                        }}
                        placeholder="Con số (VD: 98%)"
                        className="sm:col-span-4 px-3 py-1.5 text-sm font-mono border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            metrics: (cur.metrics || []).map((item, i) =>
                              i === mIdx ? { ...item, label: val } : item
                            ),
                          }));
                        }}
                        placeholder="Chú thích chỉ số..."
                        className="sm:col-span-7 px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            metrics: (cur.metrics || []).filter((_, i) => i !== mIdx),
                          }))
                        }
                        className="sm:col-span-1 p-1.5 text-slate-400 hover:text-red-600 cursor-pointer justify-self-end"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Comparison / Specs Rows */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Bảng thông số / So sánh ({subLang.toUpperCase()}) —{' '}
                      {(activeSubLoc.comparisonRows || []).length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveSubLocale(subLang, (cur) => ({
                          ...cur,
                          comparisonHeaders:
                            cur.comparisonHeaders ||
                            (subLang === 'en'
                              ? ['Specification', 'Details']
                              : subLang === 'ja'
                              ? ['項目', '仕様詳細']
                              : ['Thông số', 'Chi tiết']),
                          comparisonRows: [
                            ...(cur.comparisonRows || []),
                            { label: '', primaryValue: '' },
                          ],
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm dòng bảng</span>
                    </button>
                  </div>
                  {(activeSubLoc.comparisonRows || []).map((r: ProductSubDetailRow, rIdx: number) => (
                    <div
                      key={`${subLang}-row-${rIdx}`}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={r.label}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            comparisonRows: (cur.comparisonRows || []).map((item, i) =>
                              i === rIdx ? { ...item, label: val } : item
                            ),
                          }));
                        }}
                        placeholder="Tên dòng"
                        className="sm:col-span-4 px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        value={r.primaryValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            comparisonRows: (cur.comparisonRows || []).map((item, i) =>
                              i === rIdx ? { ...item, primaryValue: val } : item
                            ),
                          }));
                        }}
                        placeholder="Giá trị..."
                        className="sm:col-span-7 px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            comparisonRows: (cur.comparisonRows || []).filter(
                              (_, i) => i !== rIdx
                            ),
                          }))
                        }
                        className="sm:col-span-1 p-1.5 text-slate-400 hover:text-red-600 cursor-pointer justify-self-end"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* FAQ Pairs */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Câu hỏi thường gặp FAQ ({subLang.toUpperCase()}) —{' '}
                      {(activeSubLoc.faqs || []).length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveSubLocale(subLang, (cur) => ({
                          ...cur,
                          faqs: [...(cur.faqs || []), { q: '', a: '' }],
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm câu hỏi FAQ</span>
                    </button>
                  </div>
                  {(activeSubLoc.faqs || []).map((faq: ProductSubDetailFaq, fIdx: number) => (
                    <div
                      key={`${subLang}-faq-${fIdx}`}
                      className="p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateActiveSubLocale(subLang, (cur) => ({
                              ...cur,
                              faqs: (cur.faqs || []).map((item, i) =>
                                i === fIdx ? { ...item, q: val } : item
                              ),
                            }));
                          }}
                          placeholder="Câu hỏi..."
                          className="flex-1 px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveSubLocale(subLang, (cur) => ({
                              ...cur,
                              faqs: (cur.faqs || []).filter((_, i) => i !== fIdx),
                            }))
                          }
                          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateActiveSubLocale(subLang, (cur) => ({
                            ...cur,
                            faqs: (cur.faqs || []).map((item, i) =>
                              i === fIdx ? { ...item, a: val } : item
                            ),
                          }));
                        }}
                        placeholder="Câu trả lời chi tiết..."
                        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // =========================================================================
  // VIEW A: PRODUCTS LIST & QUICK VISIBILITY CONTROLS
  // =========================================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="space-y-6"
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-slate-900">
            Quản lý Sản phẩm & Trang con ({products.length} sản phẩm)
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-mono font-semibold text-emerald-700 tabular-nums">
              {visibleCount}
            </span>{' '}
            đang hiển thị công khai · Hỗ trợ cấu hình nội dung 3 ngôn ngữ (VI / EN / JA)
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên sản phẩm, SKU..."
              className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#2C64AF] w-52"
            />
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Product Cards / Rows */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
        {filteredProducts.map((prod) => {
          const isVisible = prod.isVisible !== false;
          const subCount = getResolvedSubDetails(prod, false).length;
          const visibleSubCount = getResolvedSubDetails(prod, true).length;
          const loc = resolveProductLocale(prod, lang);

          return (
            <div
              key={prod.id}
              className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F8FAFC]/70 transition-colors"
            >
              {/* Product Summary */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="w-20 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <ImageWithFallback
                    src={PRODUCT_IMAGES[prod.imageKey] || PRODUCT_IMAGES.kirara_cream}
                    alt={loc.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-[#2C64AF] tabular-nums">{prod.sku}</span>
                    <span>·</span>
                    <span>{loc.category}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 font-mono text-slate-600 tabular-nums">
                      <Layers className="w-3 h-3" />
                      {visibleSubCount}/{subCount} trang con
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-slate-500">VI / EN / JA</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate">{loc.name}</div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {prod.priceLabel}
                    </span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">Kho: {prod.stock}</span>
                  </div>
                </div>
              </div>

              {/* Right Controls: Visibility Switch + Studio Button + Delete */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isVisible}
                  onClick={() => handleQuickToggleVisibility(prod)}
                  className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span
                    className={`w-8 h-4.5 rounded-full relative transition-colors ${
                      isVisible ? 'bg-[#2C64AF]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                        isVisible ? 'left-4' : 'left-0.5'
                      }`}
                    />
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {isVisible ? 'Hiển thị' : 'Đang ẩn'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => openProductStudio(prod, 'general')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#2C64AF] hover:text-[#2C64AF] rounded-lg cursor-pointer whitespace-nowrap shrink-0"
                >
                  Cài đặt chi tiết
                </button>

                <button
                  type="button"
                  onClick={() => openProductStudio(prod, 'subpages')}
                  className="px-3.5 py-2 text-xs font-semibold text-[#2C64AF] bg-[#EFF6FF] border border-[#2C64AF]/20 hover:bg-[#2C64AF] hover:text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Trang con ({subCount})
                </button>

                {confirmDeleteProdId === prod.id ? (
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg cursor-pointer"
                    >
                      Xóa
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteProdId(null)}
                      className="px-2 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteProdId(prod.id)}
                    title="Xóa sản phẩm"
                    className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Product Modal with VI | EN | JA Tabs */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Thêm sản phẩm mới lên Website</h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="p-1.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              {/* Language Switcher inside Create Modal */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-600">
                  Nhập thông tin theo ngôn ngữ
                </span>
                <LanguageTabBar
                  value={createLang}
                  onChange={setCreateLang}
                  filledMap={{
                    vi: Boolean(newProdForm.names.vi.trim()),
                    en: Boolean(newProdForm.names.en.trim()),
                    ja: Boolean(newProdForm.names.ja.trim()),
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên sản phẩm ({createLang.toUpperCase()}) {createLang === 'vi' ? '*' : ''}
                  </label>
                  <input
                    type="text"
                    required={createLang === 'vi'}
                    value={newProdForm.names[createLang]}
                    onChange={(e) =>
                      setNewProdForm({
                        ...newProdForm,
                        names: { ...newProdForm.names, [createLang]: e.target.value },
                      })
                    }
                    placeholder={
                      createLang === 'en'
                        ? 'English product name...'
                        : createLang === 'ja'
                        ? '日本語の製品名...'
                        : 'VD: Sơn lót Clean Sealer...'
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã SKU
                  </label>
                  <input
                    type="text"
                    value={newProdForm.sku}
                    onChange={(e) => setNewProdForm({ ...newProdForm, sku: e.target.value })}
                    placeholder="VD: CLEAN-SEALER-15L"
                    className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả ngắn ({createLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={newProdForm.subtitles[createLang]}
                  onChange={(e) =>
                    setNewProdForm({
                      ...newProdForm,
                      subtitles: { ...newProdForm.subtitles, [createLang]: e.target.value },
                    })
                  }
                  placeholder={
                    createLang === 'en'
                      ? '1-line English subtitle on product card...'
                      : createLang === 'ja'
                      ? '製品カードに表示される一行説明...'
                      : 'Mô tả 1 dòng hiển thị trên thẻ sản phẩm...'
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={newProdForm.category}
                    onChange={(e) =>
                      setNewProdForm({
                        ...newProdForm,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đơn giá (VNĐ)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newProdForm.priceVnd}
                    onChange={(e) => setNewProdForm({ ...newProdForm, priceVnd: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newProdForm.stock}
                    onChange={(e) => setNewProdForm({ ...newProdForm, stock: e.target.value })}
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xuất xứ ({createLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={newProdForm.origins[createLang]}
                  onChange={(e) =>
                    setNewProdForm({
                      ...newProdForm,
                      origins: { ...newProdForm.origins, [createLang]: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chọn ảnh sản phẩm
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCT_IMAGE_CHOICES.map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => setNewProdForm({ ...newProdForm, imageKey: ch.key })}
                      className={`rounded-lg overflow-hidden border text-left cursor-pointer ${
                        newProdForm.imageKey === ch.key
                          ? 'border-[#2C64AF] ring-2 ring-[#2C64AF]/25'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100">
                        <ImageWithFallback
                          src={PRODUCT_IMAGES[ch.key]}
                          alt={ch.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-1.5 text-[11px] truncate">{ch.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 text-xs border border-slate-200 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer disabled:opacity-60"
                >
                  {creating ? 'Đang tạo...' : 'Tạo sản phẩm & Cài đặt chi tiết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
