import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  RotateCcw,
  Save,
  Search,
  Share2,
} from 'lucide-react';
import {
  INITIAL_SEO_SETTINGS,
  SEO_IMAGE_PRESETS,
  SEO_SECTION_LABELS,
  SEO_SECTION_ORDER,
} from '../data/seoDefaults';
import { useLanguage } from '../i18n/LanguageContext';
import { AppLanguage, SeoLocalizedTags, SeoSectionConfig, SeoSectionKey } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface AdminSeoModuleProps {
  onSeoChanged: () => Promise<void> | void;
  onJumpToSection?: (section: SeoSectionKey) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const LANG_OPTIONS: Array<{ code: AppLanguage; short: string; label: string }> = [
  { code: 'vi', short: 'VI', label: 'Tiếng Việt' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ja', short: 'JA', label: '日本語' },
];

const UI = {
  vi: {
    heading: 'Quản lý SEO & Open Graph',
    subheading:
      'Chỉnh sửa thẻ tiêu đề, mô tả tìm kiếm, thẻ chia sẻ mạng xã hội (Open Graph / Twitter) và lập chỉ mục cho từng phân mục website.',
    sectionsListTitle: 'Phân mục Website',
    editLangLabel: 'Ngôn ngữ nội dung SEO',
    copyFromVi: 'Điền khung từ Tiếng Việt',
    syncOgBtn: 'Đồng bộ từ Title & Description',
    saveBtn: 'Lưu cấu hình SEO',
    savingBtn: 'Đang lưu...',
    resetBtn: 'Khôi phục mặc định',
    confirmReset: 'Xác nhận khôi phục?',
    cancelReset: 'Hủy',
    previewPublic: 'Mở trang này',
    savedOk: 'Đã lưu cấu hình SEO và cập nhật thẻ <head> trực tiếp.',
    resetOk: 'Đã khôi phục cấu hình SEO mặc định cho phân mục.',
    errSave: 'Không thể lưu cấu hình SEO. Vui lòng thử lại.',
    searchTagsTitle: 'Thẻ Tìm kiếm (Title & Meta Description)',
    ogTagsTitle: 'Thẻ Chia sẻ Open Graph & X/Twitter',
    technicalTitle: 'Cấu hình Kỹ thuật & Lập chỉ mục',
    pageTitleLabel: 'Tiêu đề trang (<title>)',
    pageTitleHint: 'Khuyến nghị 30 – 60 ký tự để hiển thị đầy đủ trên Google.',
    metaDescLabel: 'Mô tả tìm kiếm (<meta name="description">)',
    metaDescHint: 'Khuyến nghị 120 – 160 ký tự, tóm tắt rõ giá trị và lời kêu gọi.',
    ogTitleLabel: 'Tiêu đề Open Graph (og:title)',
    ogDescLabel: 'Mô tả Open Graph (og:description)',
    ogTypeLabel: 'Loại nội dung (og:type)',
    ogSiteNameLabel: 'Tên website (og:site_name)',
    twitterCardLabel: 'Kiểu thẻ X / Twitter (twitter:card)',
    canonicalLabel: 'Đường dẫn chuẩn (Canonical Path)',
    robotsLabel: 'Chỉ thị Robot (meta robots)',
    keywordsLabel: 'Từ khóa gợi ý (meta keywords)',
    ogImagePresetLabel: 'Ảnh đại diện Open Graph (og:image)',
    ogImageCustomLabel: 'Hoặc đường dẫn ảnh tùy chỉnh',
    previewSerpTitle: 'Xem trước kết quả Google Search',
    previewSocialTitle: 'Xem trước thẻ chia sẻ Facebook / Zalo / LinkedIn',
    charsUnit: 'ký tự',
    statusOptimal: 'Tối ưu',
    statusShort: 'Hơi ngắn',
    statusLong: 'Vượt ngưỡng',
    loadingText: 'Đang tải cấu hình SEO...',
  },
  en: {
    heading: 'SEO & Open Graph Manager',
    subheading:
      'Update page titles, meta descriptions, Open Graph / Twitter share cards, canonical URLs, and indexing rules per site section.',
    sectionsListTitle: 'Site Sections',
    editLangLabel: 'SEO Content Language',
    copyFromVi: 'Copy base from Vietnamese',
    syncOgBtn: 'Sync from Title & Description',
    saveBtn: 'Save SEO Settings',
    savingBtn: 'Saving...',
    resetBtn: 'Reset Defaults',
    confirmReset: 'Confirm reset?',
    cancelReset: 'Cancel',
    previewPublic: 'Open Section',
    savedOk: 'SEO settings saved and applied to live document metadata.',
    resetOk: 'Section reset to default SEO configuration.',
    errSave: 'Failed to save SEO settings. Please try again.',
    searchTagsTitle: 'Search Metadata (Title & Meta Description)',
    ogTagsTitle: 'Open Graph & X/Twitter Social Tags',
    technicalTitle: 'Technical & Indexing Configuration',
    pageTitleLabel: 'Page Title (<title>)',
    pageTitleHint: 'Recommended 30 – 60 characters for clean Google snippet rendering.',
    metaDescLabel: 'Meta Description (<meta name="description">)',
    metaDescHint: 'Recommended 120 – 160 characters summarizing core value & action.',
    ogTitleLabel: 'Open Graph Title (og:title)',
    ogDescLabel: 'Open Graph Description (og:description)',
    ogTypeLabel: 'Content Type (og:type)',
    ogSiteNameLabel: 'Site Name (og:site_name)',
    twitterCardLabel: 'Twitter Card Format',
    canonicalLabel: 'Canonical Path',
    robotsLabel: 'Robots Directive',
    keywordsLabel: 'Keywords (comma-separated)',
    ogImagePresetLabel: 'Open Graph Cover Image (og:image)',
    ogImageCustomLabel: 'Or custom image path / URL',
    previewSerpTitle: 'Live Google Search Snippet Preview',
    previewSocialTitle: 'Live Open Graph Social Card Preview',
    charsUnit: 'chars',
    statusOptimal: 'Optimal',
    statusShort: 'Too short',
    statusLong: 'Too long',
    loadingText: 'Loading SEO settings...',
  },
  ja: {
    heading: 'SEO・Open Graph 管理',
    subheading:
      'サイト各セクションのページタイトル、メタディスクリプション、Open Graph / Twitterシェア設定を一元管理します。',
    sectionsListTitle: 'サイトセクション',
    editLangLabel: 'SEO設定言語',
    copyFromVi: 'ベトナム語ベースをコピー',
    syncOgBtn: 'Title・DescriptionをOGに反映',
    saveBtn: 'SEO設定を保存',
    savingBtn: '保存中...',
    resetBtn: '初期値に戻す',
    confirmReset: 'リセットを実行？',
    cancelReset: 'キャンセル',
    previewPublic: '公開ページを開く',
    savedOk: 'SEO設定を保存し、ライブメタデータへ反映しました。',
    resetOk: '選択セクションを初期設定に戻しました。',
    errSave: '保存に失敗しました。もう一度お試しください。',
    searchTagsTitle: '検索エンジン向けメタデータ',
    ogTagsTitle: 'Open Graph / SNSシェアカード設定',
    technicalTitle: 'テクニカル・インデックス設定',
    pageTitleLabel: 'ページタイトル (<title>)',
    pageTitleHint: '検索結果での最適な表示のため 30〜60 文字を推奨します。',
    metaDescLabel: 'メタディスクリプション (<meta name="description">)',
    metaDescHint: '概要と行動喚起を 120〜160 文字程度で設定してください。',
    ogTitleLabel: 'Open Graph タイトル (og:title)',
    ogDescLabel: 'Open Graph 説明文 (og:description)',
    ogTypeLabel: 'コンテンツ種別 (og:type)',
    ogSiteNameLabel: 'サイト名 (og:site_name)',
    twitterCardLabel: 'Twitterカード形式',
    canonicalLabel: 'Canonicalパス',
    robotsLabel: 'Robotsディレクティブ',
    keywordsLabel: 'キーワード',
    ogImagePresetLabel: 'Open Graph 画像 (og:image)',
    ogImageCustomLabel: 'カスタム画像パス / URL',
    previewSerpTitle: 'Google検索スニペット プレビュー',
    previewSocialTitle: 'SNSシェアカード プレビュー (Facebook / Zalo / LinkedIn)',
    charsUnit: '文字',
    statusOptimal: '最適',
    statusShort: '短め',
    statusLong: '超過',
    loadingText: 'SEO設定を読み込み中...',
  },
} as const;

function getLengthStatus(
  len: number,
  min: number,
  max: number,
  labels: { statusShort: string; statusOptimal: string; statusLong: string }
) {
  if (len === 0 || len < min) {
    return {
      text: labels.statusShort,
      cls: 'text-amber-700',
    };
  }
  if (len > max) {
    return {
      text: labels.statusLong,
      cls: 'text-red-700',
    };
  }
  return {
    text: labels.statusOptimal,
    cls: 'text-emerald-700',
  };
}

export function AdminSeoModule({
  onSeoChanged,
  onJumpToSection,
}: AdminSeoModuleProps) {
  const { lang } = useLanguage();
  const t = UI[lang];

  const [items, setItems] = useState<SeoSectionConfig[]>(INITIAL_SEO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<SeoSectionKey>('home');
  const [editLang, setEditLang] = useState<AppLanguage>(lang);
  const [draft, setDraft] = useState<SeoSectionConfig>(INITIAL_SEO_SETTINGS[0]);

  const [saving, setSaving] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function fetchSeoSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/seo');
      if (res.ok) {
        const data = (await res.json()) as SeoSectionConfig[];
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          const match = data.find((d) => d.section === selectedSection) || data[0];
          setDraft(structuredClone(match));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  function handleSelectSection(section: SeoSectionKey) {
    setSelectedSection(section);
    setConfirmingReset(false);
    setFeedback(null);
    const found =
      items.find((i) => i.section === section) ||
      INITIAL_SEO_SETTINGS.find((i) => i.section === section)!;
    setDraft(structuredClone(found));
  }

  function updateLocalizedField<K extends keyof SeoLocalizedTags>(
    field: K,
    value: SeoLocalizedTags[K]
  ) {
    setDraft((prev) => ({
      ...prev,
      [editLang]: {
        ...prev[editLang],
        [field]: value,
      },
    }));
  }

  function handleSyncOgFromSearch() {
    setDraft((prev) => ({
      ...prev,
      [editLang]: {
        ...prev[editLang],
        ogTitle: prev[editLang].title,
        ogDescription: prev[editLang].metaDescription,
      },
    }));
  }

  function handleCopyFromVi() {
    if (editLang === 'vi') return;
    setDraft((prev) => ({
      ...prev,
      [editLang]: { ...prev.vi },
    }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/seo/${draft.section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        setFeedback({ type: 'err', text: t.errSave });
        return;
      }
      const saved = (await res.json()) as SeoSectionConfig;
      setItems((prev) =>
        prev.map((item) => (item.section === saved.section ? saved : item))
      );
      setDraft(structuredClone(saved));
      setFeedback({ type: 'ok', text: t.savedOk });
      await onSeoChanged();
    } catch {
      setFeedback({ type: 'err', text: t.errSave });
    } finally {
      setSaving(false);
    }
  }

  async function handleResetSection() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/seo/${draft.section}/reset`, {
        method: 'POST',
      });
      if (res.ok) {
        const resetData = (await res.json()) as SeoSectionConfig;
        setItems((prev) =>
          prev.map((item) => (item.section === resetData.section ? resetData : item))
        );
        setDraft(structuredClone(resetData));
        setConfirmingReset(false);
        setFeedback({ type: 'ok', text: t.resetOk });
        await onSeoChanged();
      } else {
        setFeedback({ type: 'err', text: t.errSave });
      }
    } catch {
      setFeedback({ type: 'err', text: t.errSave });
    } finally {
      setSaving(false);
    }
  }

  const activeTags = draft[editLang] || draft.vi;
  const titleLen = activeTags.title.length;
  const descLen = activeTags.metaDescription.length;
  const titleHealth = getLengthStatus(titleLen, 30, 60, t);
  const descHealth = getLengthStatus(descLen, 120, 160, t);

  const previewUrl = useMemo(() => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://harian.vn';
    const pathPart = draft.canonicalPath.startsWith('/')
      ? draft.canonicalPath
      : `/${draft.canonicalPath}`;
    return `${origin}${pathPart}`;
  }, [draft.canonicalPath]);

  const previewHost = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.host;
    return 'harian.vn';
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
        {t.loadingText}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: EASE }}
      className="space-y-6"
    >
      {/* Top Module Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t.heading}</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t.subheading}
          </p>
        </div>

        {onJumpToSection && (
          <button
            type="button"
            onClick={() => onJumpToSection(draft.section)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#2C64AF] bg-white border border-slate-200 hover:border-[#2C64AF] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>{t.previewPublic}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Split Workspace: Left Section Switcher + Right Editor & Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Section Switcher Column */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              {t.sectionsListTitle}
            </span>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              {SEO_SECTION_ORDER.length}
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {SEO_SECTION_ORDER.map((sectionKey) => {
              const cfg =
                items.find((i) => i.section === sectionKey) ||
                INITIAL_SEO_SETTINGS.find((i) => i.section === sectionKey)!;
              const meta = SEO_SECTION_LABELS[sectionKey][lang];
              const isSelected = selectedSection === sectionKey;
              const currentTitle = (cfg[editLang] || cfg.vi).title;
              return (
                <button
                  key={sectionKey}
                  type="button"
                  onClick={() => handleSelectSection(sectionKey)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#EFF6FF]' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isSelected ? 'text-[#2C64AF]' : 'text-slate-900'
                      }`}
                    >
                      {meta.label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                      {cfg.canonicalPath}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                    {currentTitle}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono tabular-nums">
                    <span>{cfg.ogType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{cfg.robots}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {currentTitle.length} {t.charsUnit}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Editor Form + Live Previews */}
        <div className="xl:col-span-8 space-y-6">
          <form
            onSubmit={handleSave}
            className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-6"
          >
            {/* Active Section Header + Language Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-[#2C64AF] mb-0.5">
                  {draft.canonicalPath} · {draft.robots}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {SEO_SECTION_LABELS[draft.section][lang].label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {SEO_SECTION_LABELS[draft.section][lang].description}
                </p>
              </div>

              <div
                role="tablist"
                aria-label={t.editLangLabel}
                className="inline-flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200 rounded-lg self-start shrink-0"
              >
                {LANG_OPTIONS.map((opt) => {
                  const active = editLang === opt.code;
                  const filled = Boolean(
                    draft[opt.code]?.title?.trim() &&
                      draft[opt.code]?.metaDescription?.trim()
                  );
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setEditLang(opt.code)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="font-mono text-[11px] text-[#2C64AF]">
                        {opt.short}
                      </span>
                      <span>{opt.label}</span>
                      {filled && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-lg border text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Helper toolbar for localized content */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Search className="w-3.5 h-3.5 text-[#2C64AF]" />
                <span>{t.searchTagsTitle}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {editLang !== 'vi' && (
                  <button
                    type="button"
                    onClick={handleCopyFromVi}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyFromVi}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSyncOgFromSearch}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#2C64AF] bg-[#EFF6FF] border border-[#2C64AF]/20 hover:border-[#2C64AF] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.syncOgBtn}</span>
                </button>
              </div>
            </div>

            {/* Search Title & Meta Description */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t.pageTitleLabel}
                  </label>
                  <span
                    className={`font-mono text-xs tabular-nums font-medium ${titleHealth.cls}`}
                  >
                    {titleLen} {t.charsUnit} · {titleHealth.text}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={activeTags.title}
                  onChange={(e) => updateLocalizedField('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <p className="text-[11px] text-slate-500 mt-1">{t.pageTitleHint}</p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t.metaDescLabel}
                  </label>
                  <span
                    className={`font-mono text-xs tabular-nums font-medium ${descHealth.cls}`}
                  >
                    {descLen} {t.charsUnit} · {descHealth.text}
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={activeTags.metaDescription}
                  onChange={(e) =>
                    updateLocalizedField('metaDescription', e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <p className="text-[11px] text-slate-500 mt-1">{t.metaDescHint}</p>
              </div>
            </div>

            {/* Open Graph Localized Tags */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Share2 className="w-3.5 h-3.5 text-[#2C64AF]" />
                <span>{t.ogTagsTitle}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.ogTitleLabel}
                </label>
                <input
                  type="text"
                  value={activeTags.ogTitle}
                  onChange={(e) => updateLocalizedField('ogTitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.ogDescLabel}
                </label>
                <textarea
                  rows={2}
                  value={activeTags.ogDescription}
                  onChange={(e) =>
                    updateLocalizedField('ogDescription', e.target.value)
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
              </div>
            </div>

            {/* Shared Open Graph & Technical Settings */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Globe className="w-3.5 h-3.5 text-[#2C64AF]" />
                <span>{t.technicalTitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.ogTypeLabel}
                  </label>
                  <select
                    value={draft.ogType}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        ogType: e.target.value as SeoSectionConfig['ogType'],
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  >
                    <option value="website">website</option>
                    <option value="product">product</option>
                    <option value="article">article</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.twitterCardLabel}
                  </label>
                  <select
                    value={draft.twitterCard}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        twitterCard: e.target.value as SeoSectionConfig['twitterCard'],
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  >
                    <option value="summary_large_image">summary_large_image</option>
                    <option value="summary">summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.robotsLabel}
                  </label>
                  <select
                    value={draft.robots}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        robots: e.target.value as SeoSectionConfig['robots'],
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  >
                    <option value="index, follow">index, follow</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.ogSiteNameLabel}
                  </label>
                  <input
                    type="text"
                    value={draft.ogSiteName}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, ogSiteName: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.canonicalLabel}
                  </label>
                  <input
                    type="text"
                    value={draft.canonicalPath}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, canonicalPath: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.keywordsLabel}
                </label>
                <input
                  type="text"
                  value={draft.keywords}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, keywords: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.ogImagePresetLabel}
                  </label>
                  <select
                    value={
                      SEO_IMAGE_PRESETS.some((p) => p.path === draft.ogImage)
                        ? draft.ogImage
                        : ''
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        setDraft((prev) => ({ ...prev, ogImage: e.target.value }));
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  >
                    <option value="">-- Custom Path / URL --</option>
                    {SEO_IMAGE_PRESETS.map((preset) => (
                      <option key={preset.path} value={preset.path}>
                        {lang === 'ja'
                          ? preset.labelJa
                          : lang === 'en'
                          ? preset.labelEn
                          : preset.labelVi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.ogImageCustomLabel}
                  </label>
                  <input
                    type="text"
                    value={draft.ogImage}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, ogImage: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {confirmingReset ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-red-700">
                    {t.confirmReset}
                  </span>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleResetSection}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    {t.resetBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    {t.cancelReset}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingReset(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetBtn}</span>
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? t.savingBtn : t.saveBtn}</span>
              </button>
            </div>
          </form>

          {/* Live SERP & Social Card Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Google SERP Preview */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="text-xs font-semibold text-slate-700 pb-2 border-b border-slate-200">
                {t.previewSerpTitle}
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-mono">{previewUrl}</span>
                </div>
                <div className="text-[17px] font-medium text-[#1A0DAB] leading-snug line-clamp-2">
                  {activeTags.title || 'Harian Corporation Vietnam'}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {activeTags.metaDescription}
                </p>
              </div>
            </div>

            {/* Social Share Card (Open Graph) Preview */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-700">
                {t.previewSocialTitle}
              </div>
              <div className="aspect-[16/9] bg-slate-100 border-b border-slate-200 overflow-hidden">
                <ImageWithFallback
                  src={draft.ogImage}
                  alt={activeTags.ogTitle || activeTags.title}
                  fallbackTitle={activeTags.ogTitle || activeTags.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-[#F8FAFC] space-y-1">
                <div className="text-[11px] font-mono text-slate-500 uppercase truncate">
                  {previewHost} · {draft.ogSiteName}
                </div>
                <div className="text-sm font-bold text-slate-900 line-clamp-1">
                  {activeTags.ogTitle || activeTags.title}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {activeTags.ogDescription || activeTags.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
