import { FormEvent, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  MapPin,
  ShoppingBag,
  Send,
} from 'lucide-react';
import { ARTICLE_IMAGES, KIRARA_COLORS } from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import { resolveProductLocale, resolveSubDetailLocale } from '../i18n/productLocale';
import {
  ConsultationRequest,
  KiraraColorSwatch,
  ProductItem,
  ProductSubDetail,
  SalesOrder,
} from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface ProductSubDetailPageProps {
  product: ProductItem;
  subDetail: ProductSubDetail;
  allSubDetails: ProductSubDetail[];
  onBackToProduct: () => void;
  onBackHome: () => void;
  onSelectSubDetail: (slug: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductSubDetailPage({
  product,
  subDetail,
  allSubDetails,
  onBackToProduct,
  onBackHome,
  onSelectSubDetail,
}: ProductSubDetailPageProps) {
  const { lang } = useLanguage();
  const locProd = resolveProductLocale(product, lang);
  const productName = locProd.name;
  const variants = locProd.variants;
  const content = resolveSubDetailLocale(subDetail, lang);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Embedded Online Order checkout state (when kind === 'order')
  const isKiraraCream = product.id === 'kirara-cream';
  const [selectedVariant, setSelectedVariant] = useState(variants[0] || '');
  const [selectedSwatch, setSelectedSwatch] = useState<KiraraColorSwatch>(KIRARA_COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<SalesOrder | null>(null);

  // Embedded Inquiry booking state (when kind === 'inquiry')
  const [inqName, setInqName] = useState('');
  const [inqCompany, setInqCompany] = useState('');
  const [inqEmail, setInqEmail] = useState('');
  const [inqPhone, setInqPhone] = useState('');
  const [inqDate, setInqDate] = useState('');
  const [inqMessage, setInqMessage] = useState('');
  const [inqSubmitting, setInqSubmitting] = useState(false);
  const [inqError, setInqError] = useState('');
  const [createdInquiry, setCreatedInquiry] = useState<ConsultationRequest | null>(null);

  useEffect(() => {
    setSelectedVariant(variants[0] || '');
    setOpenFaqIndex(0);
    setOrderError('');
    setCreatedOrder(null);
    setInqError('');
    setCreatedInquiry(null);
  }, [product.id, subDetail.slug, lang]);

  const totalVnd = product.priceVnd * quantity;

  async function handleOrderSubmit(e: FormEvent) {
    e.preventDefault();
    setOrderError('');
    setOrderSubmitting(true);
    try {
      const variantLabel = isKiraraCream
        ? `${selectedVariant} · ${selectedSwatch.code} ${selectedSwatch.name}`
        : selectedVariant;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variant: variantLabel,
          quantity,
          customerName,
          companyName,
          email,
          phone,
          shippingAddress,
          note: orderNote,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error || 'Error');
        return;
      }
      setCreatedOrder(data as SalesOrder);
      setCustomerName('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setShippingAddress('');
      setOrderNote('');
    } catch {
      setOrderError(
        lang === 'ja'
          ? '通信エラーが発生しました。'
          : lang === 'en'
          ? 'Server connection error.'
          : 'Lỗi kết nối máy chủ.'
      );
    } finally {
      setOrderSubmitting(false);
    }
  }

  async function handleInquirySubmit(e: FormEvent) {
    e.preventDefault();
    setInqError('');
    setInqSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: inqName,
          companyName: inqCompany,
          email: inqEmail,
          phone: inqPhone,
          serviceType:
            lang === 'ja'
              ? `製品技術相談 (${productName})`
              : lang === 'en'
              ? `Technical Product Inquiry (${productName})`
              : `Tư vấn kỹ thuật sản phẩm (${productName})`,
          productInterest: productName,
          preferredDate: inqDate,
          message: inqMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInqError(data.error || 'Error');
        return;
      }
      setCreatedInquiry(data as ConsultationRequest);
      setInqName('');
      setInqCompany('');
      setInqEmail('');
      setInqPhone('');
      setInqDate('');
      setInqMessage('');
    } catch {
      setInqError(
        lang === 'ja'
          ? '通信エラーが発生しました。'
          : lang === 'en'
          ? 'Server connection error.'
          : 'Lỗi kết nối máy chủ.'
      );
    } finally {
      setInqSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="bg-white min-h-[82vh]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Top Breadcrumbs + Back */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#2C64AF] transition-colors cursor-pointer"
            >
              {lang === 'ja' ? 'ホーム' : lang === 'en' ? 'Home' : 'Trang chủ'}
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={onBackToProduct}
              className="hover:text-[#2C64AF] transition-colors cursor-pointer"
            >
              {productName}
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">{content.cardTitle}</span>
          </div>

          <button
            type="button"
            onClick={onBackToProduct}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2C64AF] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {lang === 'ja'
                ? `${productName} トップへ`
                : lang === 'en'
                ? `Back to ${productName}`
                : `Quay lại ${productName}`}
            </span>
          </button>
        </div>

        {/* Split Layout: Main Content (8 cols) + Sibling Directory Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Editorial Title + Lead + Banner Photo */}
            <header className="space-y-4">
              <div className="text-xs font-semibold tracking-wider uppercase text-[#2C64AF]">
                {content.eyebrow}
              </div>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {content.pageTitle}
              </h1>
              <p className="font-serif text-base sm:text-lg text-slate-600 leading-relaxed">
                {content.lead}
              </p>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 mt-6">
                <ImageWithFallback
                  src={ARTICLE_IMAGES[subDetail.imageKey]}
                  alt={content.pageTitle}
                  fallbackTitle={content.cardTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white">
                  <span className="font-serif text-sm sm:text-base font-medium">
                    {productName} · {content.cardTitle}
                  </span>
                  <span className="font-mono text-xs text-white/80 tabular-nums">
                    {product.sku}
                  </span>
                </div>
              </div>
            </header>

            {/* Quantified Key Metrics */}
            {content.metrics && content.metrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {content.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC]"
                  >
                    <div className="font-mono text-2xl font-bold text-[#2C64AF] tabular-nums">
                      {m.value}
                    </div>
                    <div className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Editorial Sections */}
            {content.sections.length > 0 && (
              <div className="space-y-8">
                {content.sections.map((sec) => (
                  <section key={sec.heading} className="space-y-3">
                    <h2 className="text-xl font-bold text-slate-900">{sec.heading}</h2>
                    <p className="text-sm sm:text-[15px] leading-7 text-slate-700">{sec.body}</p>
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="space-y-2.5 pt-2">
                        {sec.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-slate-700"
                          >
                            <Check className="w-4 h-4 text-[#2C64AF] shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* Comparison or Technical Specification Table */}
            {content.comparisonRows && content.comparisonRows.length > 0 && (
              <section className="space-y-4">
                {content.comparisonHeaders && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-sm">
                    <div
                      className={`grid ${
                        content.comparisonHeaders[2]
                          ? 'grid-cols-1 sm:grid-cols-3'
                          : 'grid-cols-1 sm:grid-cols-3'
                      } bg-[#F8FAFC] border-b border-slate-200 font-semibold text-slate-900`}
                    >
                      <div className="px-5 py-3.5">{content.comparisonHeaders[0]}</div>
                      <div
                        className={`px-5 py-3.5 text-[#2C64AF] ${
                          content.comparisonHeaders[2] ? '' : 'sm:col-span-2'
                        }`}
                      >
                        {content.comparisonHeaders[1]}
                      </div>
                      {content.comparisonHeaders[2] && (
                        <div className="px-5 py-3.5 text-slate-500">
                          {content.comparisonHeaders[2]}
                        </div>
                      )}
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      {content.comparisonRows.map((row) => (
                        <div key={row.label} className="grid grid-cols-1 sm:grid-cols-3">
                          <div className="px-5 py-3.5 font-medium text-slate-800 bg-[#F8FAFC]/50 sm:border-r border-slate-200">
                            {row.label}
                          </div>
                          <div
                            className={`px-5 py-3.5 text-slate-700 leading-relaxed ${
                              row.secondaryValue ? 'sm:border-r border-slate-200' : 'sm:col-span-2'
                            }`}
                          >
                            {row.primaryValue}
                          </div>
                          {row.secondaryValue && (
                            <div className="px-5 py-3.5 text-slate-500 leading-relaxed">
                              {row.secondaryValue}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* FAQ Accordion */}
            {content.faqs && content.faqs.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {lang === 'ja'
                    ? 'よくある質問一覧'
                    : lang === 'en'
                    ? 'Frequently Asked Questions'
                    : 'Giải đáp chi tiết'}
                </h2>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
                  {content.faqs.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={item.q} className="bg-white">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-slate-900">{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-[#2C64AF]' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: EASE }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-4 text-sm text-slate-600 leading-7 bg-[#F8FAFC]/60">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Case Examples Grid */}
            {content.examples && content.examples.length > 0 && (
              <section className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {content.examples.map((ex) => (
                    <div
                      key={ex.title}
                      className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium text-[#2C64AF]">
                          <MapPin className="w-3.5 h-3.5" />
                          {ex.location}
                        </span>
                        <span className="font-mono tabular-nums">{ex.area}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900">
                        {ex.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {ex.note}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Embedded Online Order Checkout Form when subDetail.kind === 'order' */}
            {subDetail.kind === 'order' && (
              <section className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {lang === 'ja'
                        ? `${productName} オンライン注文フォーム`
                        : lang === 'en'
                        ? `Order ${productName} Online`
                        : `Đặt mua trực tuyến ${productName}`}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {lang === 'ja'
                        ? 'ご注文情報はHarian受注管理システムに即時登録されます'
                        : lang === 'en'
                        ? 'Orders are registered directly into the Harian sales management portal'
                        : 'Đơn hàng được lưu trực tiếp vào hệ thống quản trị Harian'}
                    </p>
                  </div>
                  <div className="font-mono text-lg font-bold text-[#2C64AF] tabular-nums">
                    {totalVnd.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>

                {/* Variant & Swatch Pickers */}
                <div className="space-y-4 pt-3 border-t border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-700 mb-2">
                      {lang === 'ja'
                        ? '規格・サイズを選択'
                        : lang === 'en'
                        ? 'Select Packaging / Size'
                        : 'Chọn quy cách'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            selectedVariant === v
                              ? 'bg-[#2C64AF] text-white border-[#2C64AF]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isKiraraCream && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {lang === 'ja'
                            ? '天然カラー選択 (32色)'
                            : lang === 'en'
                            ? 'Natural Mineral Shade (32 Colors)'
                            : 'Chọn màu sắc (32 màu tự nhiên)'}
                        </span>
                        <span className="font-mono text-xs text-[#2C64AF] tabular-nums">
                          #{selectedSwatch.code} · {selectedSwatch.name}
                        </span>
                      </div>
                      <div className="grid grid-cols-8 gap-1.5">
                        {KIRARA_COLORS.map((sw) => (
                          <button
                            key={sw.code}
                            type="button"
                            onClick={() => setSelectedSwatch(sw)}
                            title={`${sw.code} · ${sw.name}`}
                            className={`h-6 rounded border cursor-pointer transition-transform ${
                              selectedSwatch.code === sw.code
                                ? 'ring-2 ring-[#2C64AF] border-[#2C64AF] scale-110'
                                : 'border-black/10 hover:scale-105'
                            }`}
                            style={{ backgroundColor: sw.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700">
                      {lang === 'ja' ? '数量' : lang === 'en' ? 'Quantity' : 'Số lượng'}
                    </span>
                    <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 font-mono text-sm font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                        className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {createdOrder ? (
                  <div className="p-5 rounded-xl bg-white border border-emerald-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {lang === 'ja'
                          ? 'ご注文を受け付けました'
                          : lang === 'en'
                          ? 'Order registered successfully'
                          : 'Đã tạo đơn hàng thành công'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">
                      {lang === 'ja' ? '注文番号:' : lang === 'en' ? 'Order code:' : 'Mã đơn hàng:'}{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {createdOrder.code}
                      </span>
                    </p>
                    <p className="text-xs text-slate-600">
                      {createdOrder.productName} · {createdOrder.variant} × {createdOrder.quantity} ·{' '}
                      <span className="font-mono font-semibold text-[#2C64AF]">
                        {createdOrder.totalVnd.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setCreatedOrder(null)}
                      className="mt-1 px-4 py-2 text-xs font-semibold text-[#2C64AF] bg-[#F8FAFC] border border-slate-200 rounded-lg cursor-pointer"
                    >
                      {lang === 'ja' ? '続けて注文する' : lang === 'en' ? 'Create another order' : 'Tạo đơn hàng mới'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleOrderSubmit} className="space-y-3 pt-2">
                    {orderError && (
                      <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {orderError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={lang === 'ja' ? 'お名前 *' : lang === 'en' ? 'Recipient name *' : 'Họ tên người nhận *'}
                        className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={lang === 'ja' ? '貴社名（任意）' : lang === 'en' ? 'Company (optional)' : 'Tên công ty (nếu có)'}
                        className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email *"
                        className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={lang === 'ja' ? '電話番号 *' : lang === 'en' ? 'Phone number *' : 'Số điện thoại *'}
                        className="px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder={lang === 'ja' ? 'お届け先住所 *' : lang === 'en' ? 'Delivery address *' : 'Địa chỉ giao hàng *'}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder={lang === 'ja' ? '備考（VAT領収書・希望納期など）' : lang === 'en' ? 'Notes (VAT invoice, delivery schedule...)' : 'Ghi chú (xuất VAT, tiến độ giao hàng...)'}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <button
                      type="submit"
                      disabled={orderSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {orderSubmitting
                          ? lang === 'ja'
                            ? '送信中...'
                            : lang === 'en'
                            ? 'Submitting...'
                            : 'Đang tạo đơn...'
                          : lang === 'ja'
                          ? '注文を確定する'
                          : lang === 'en'
                          ? 'Confirm Order'
                          : 'Xác nhận đặt hàng'}
                      </span>
                    </button>
                  </form>
                )}
              </section>
            )}

            {/* Embedded Inquiry Form when subDetail.kind === 'inquiry' */}
            {subDetail.kind === 'inquiry' && (
              <section className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === 'ja'
                      ? `${productName} 導入・技術相談フォーム`
                      : lang === 'en'
                      ? `Technical & Project Inquiry — ${productName}`
                      : `Gửi yêu cầu tư vấn về ${productName}`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === 'ja'
                      ? '担当者より営業時間内4時間以内にご連絡いたします'
                      : lang === 'en'
                      ? 'Harian technical specialists will reply within 4 business hours'
                      : 'Chuyên gia kỹ thuật Harian sẽ phản hồi trong vòng 4 giờ làm việc'}
                  </p>
                </div>

                {createdInquiry ? (
                  <div className="p-5 rounded-xl bg-white border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {lang === 'ja'
                          ? 'お問合せを受け付けました'
                          : lang === 'en'
                          ? 'Inquiry submitted successfully'
                          : 'Đã gửi yêu cầu tư vấn thành công'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {lang === 'ja' ? '受付番号:' : lang === 'en' ? 'Reference ID:' : 'Mã hồ sơ:'}{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {createdInquiry.code}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setCreatedInquiry(null)}
                      className="px-4 py-2 text-xs font-semibold text-[#2C64AF] bg-[#F8FAFC] border border-slate-200 rounded-lg cursor-pointer"
                    >
                      {lang === 'ja' ? '別のお問合せを送る' : lang === 'en' ? 'Send another inquiry' : 'Gửi thêm yêu cầu khác'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    {inqError && (
                      <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {inqError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={inqName}
                        onChange={(e) => setInqName(e.target.value)}
                        placeholder={lang === 'ja' ? 'お名前 *' : lang === 'en' ? 'Full name *' : 'Họ và tên *'}
                        className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="text"
                        value={inqCompany}
                        onChange={(e) => setInqCompany(e.target.value)}
                        placeholder={lang === 'ja' ? '貴社名 / 設計事務所' : lang === 'en' ? 'Company / Architecture Firm' : 'Công ty / Đơn vị thiết kế'}
                        className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="email"
                        required
                        value={inqEmail}
                        onChange={(e) => setInqEmail(e.target.value)}
                        placeholder="Email *"
                        className="px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="tel"
                        required
                        value={inqPhone}
                        onChange={(e) => setInqPhone(e.target.value)}
                        placeholder={lang === 'ja' ? '電話番号 *' : lang === 'en' ? 'Phone number *' : 'Số điện thoại *'}
                        className="px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="date"
                        value={inqDate}
                        onChange={(e) => setInqDate(e.target.value)}
                        className="px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={inqMessage}
                      onChange={(e) => setInqMessage(e.target.value)}
                      placeholder={
                        lang === 'ja'
                          ? '施工予定面積・希望カラー・ご相談内容をご記入ください'
                          : lang === 'en'
                          ? 'Describe estimated wall area (m²), preferred shades, or technical questions...'
                          : 'Mô tả diện tích dự kiến, hạng mục công trình hoặc câu hỏi kỹ thuật...'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <button
                      type="submit"
                      disabled={inqSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {inqSubmitting
                          ? lang === 'ja'
                            ? '送信中...'
                            : lang === 'en'
                            ? 'Submitting...'
                            : 'Đang gửi...'
                          : lang === 'ja'
                          ? '相談を申し込む'
                          : lang === 'en'
                          ? 'Submit Inquiry'
                          : 'Gửi yêu cầu tư vấn'}
                      </span>
                    </button>
                  </form>
                )}
              </section>
            )}

            {/* Quick Bottom CTA Strip for editorial subpages */}
            {subDetail.kind === 'editorial' && (
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {lang === 'ja'
                      ? `${productName} の導入をご検討中ですか？`
                      : lang === 'en'
                      ? `Interested in ordering or specifying ${productName}?`
                      : `Cần thêm dữ liệu hoặc đặt mua ${productName}?`}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {lang === 'ja'
                      ? 'サンプル請求・お見積り・オンライン注文へ直接進めます'
                      : lang === 'en'
                      ? 'Jump straight to online ordering or request a technical consultation'
                      : 'Chuyển nhanh sang trang đặt hàng trực tuyến hoặc gửi yêu cầu tư vấn'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectSubDetail('online-shop')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ja'
                        ? 'オンライン注文へ'
                        : lang === 'en'
                        ? 'Order Online'
                        : 'Đặt hàng ngay'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectSubDetail('inquiry')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#2C64AF] hover:text-[#2C64AF] rounded-lg transition-colors cursor-pointer"
                  >
                    <span>
                      {lang === 'ja' ? 'お問合せ' : lang === 'en' ? 'Contact Advisory' : 'Liên hệ tư vấn'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Sibling Sub-Page Directory */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFC]">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                {lang === 'ja'
                  ? `${productName} 詳細コンテンツ`
                  : lang === 'en'
                  ? `${productName} Directory`
                  : `Chuyên mục ${productName}`}
              </div>
              <div className="space-y-1.5">
                {allSubDetails.map((item, idx) => {
                  const loc = resolveSubDetailLocale(item, lang);
                  const active = item.slug === subDetail.slug;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => onSelectSubDetail(item.slug)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#2C64AF] text-white'
                          : 'bg-white text-slate-700 border border-slate-200/80 hover:border-[#2C64AF]/50 hover:text-[#2C64AF]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`font-mono text-[11px] tabular-nums shrink-0 ${
                            active ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate">{loc.cardTitle}</span>
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          active ? 'text-white' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
