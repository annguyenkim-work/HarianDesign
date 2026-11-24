import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { ARTICLE_IMAGES, KIRARA_COLORS, PRODUCT_IMAGES } from '../data/catalog';
import { getResolvedSubDetails } from '../data/productSubDetails';
import { useLanguage } from '../i18n/LanguageContext';
import { resolveProductLocale, resolveSubDetailLocale } from '../i18n/productLocale';
import { KiraraColorSwatch, ProductItem, SalesOrder } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface ProductDetailPageProps {
  product: ProductItem;
  allProducts: ProductItem[];
  onBackHome: () => void;
  onSelectProduct: (id: string) => void;
  onSelectSubDetail: (productId: string, subSlug: string) => void;
  onRequestConsultation: (productName: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductDetailPage({
  product,
  allProducts,
  onBackHome,
  onSelectProduct,
  onSelectSubDetail,
  onRequestConsultation,
}: ProductDetailPageProps) {
  const { lang } = useLanguage();
  const locProd = resolveProductLocale(product, lang);
  const subDetails = getResolvedSubDetails(product, true);

  const {
    name,
    subtitle,
    category,
    stockLabel,
    variants,
    origin,
    summary,
    highlights,
    specs,
  } = locProd;

  const [selectedVariant, setSelectedVariant] = useState(variants[0] || '');
  const [selectedSwatch, setSelectedSwatch] = useState<KiraraColorSwatch>(KIRARA_COLORS[0]);
  const [quantity, setQuantity] = useState(1);

  // Order checkout form state
  const [orderOpen, setOrderOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<SalesOrder | null>(null);

  useEffect(() => {
    setSelectedVariant(variants[0] || '');
    setQuantity(1);
    setOrderOpen(false);
    setOrderError('');
    setCreatedOrder(null);
  }, [product.id, lang]);

  const isKiraraCream = product.id === 'kirara-cream';
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.isVisible !== false)
    .slice(0, 3);
  const totalVnd = product.priceVnd * quantity;

  async function handleOrderSubmit(e: FormEvent) {
    e.preventDefault();
    setOrderError('');
    setSubmitting(true);
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
          note,
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
      setNote('');
    } catch {
      setOrderError(
        lang === 'ja'
          ? '通信エラーが発生しました。'
          : lang === 'en'
          ? 'Server connection error.'
          : 'Lỗi kết nối máy chủ.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="bg-white min-h-[80vh]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {/* Breadcrumb & Back */}
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
            <span>{lang === 'ja' ? '製品一覧' : lang === 'en' ? 'Products' : 'Sản phẩm'}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">{name}</span>
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
                ? 'Back to catalog'
                : 'Quay lại trang chủ'}
            </span>
          </button>
        </div>

        {/* Product Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <ImageWithFallback
                src={PRODUCT_IMAGES[product.imageKey]}
                alt={name}
                fallbackTitle={name}
                className="w-full h-full object-cover"
              />
            </div>

            {isKiraraCream && (
              <div className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-800">
                    {lang === 'ja'
                      ? '選択中の天然カラー (全32色)'
                      : lang === 'en'
                      ? 'Selected Natural Mineral Shade (32 Colors)'
                      : 'Chọn sắc thái màu tự nhiên (32 màu)'}
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
                      className={`h-7 rounded border transition-transform cursor-pointer ${
                        selectedSwatch.code === sw.code
                          ? 'ring-2 ring-[#2C64AF] border-[#2C64AF] scale-105'
                          : 'border-black/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: sw.hex }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Specification & Order Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-medium text-[#2C64AF]">{category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{product.sku}</span>
                <span aria-hidden="true">·</span>
                <span>{origin}</span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2"
                style={{ textWrap: 'balance' }}
              >
                {name}
              </h1>
              <p className="font-serif text-base text-slate-600 leading-relaxed">{subtitle}</p>
            </div>

            <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">
                  {lang === 'ja'
                    ? '標準参考価格'
                    : lang === 'en'
                    ? 'Reference Price'
                    : 'Đơn giá tham khảo'}
                </div>
                <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                  {product.priceLabel}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">
                  {lang === 'ja' ? '在庫状況' : lang === 'en' ? 'Availability' : 'Tình trạng kho'}
                </div>
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 mt-0.5">
                  <Package className="w-4 h-4" />
                  <span>{stockLabel}</span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-700">{summary}</p>

            {/* Variant & Quantity Picker */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'ja'
                    ? '容量・仕様を選択'
                    : lang === 'en'
                    ? 'Select Packaging / Variant'
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

              <div className="flex flex-wrap items-center justify-between gap-4">
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

                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    {lang === 'ja'
                      ? '合計金額（目安）'
                      : lang === 'en'
                      ? 'Estimated Total'
                      : 'Tạm tính'}
                  </div>
                  <div className="font-mono text-lg font-bold text-[#2C64AF] tabular-nums">
                    {totalVnd.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrderOpen((prev) => !prev);
                    setCreatedOrder(null);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {lang === 'ja'
                      ? 'この製品を注文・見積依頼する'
                      : lang === 'en'
                      ? 'Order / Request Quote'
                      : 'Đặt hàng / Yêu cầu báo giá'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRequestConsultation(name)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#2C64AF] hover:text-[#2C64AF] rounded-lg transition-colors cursor-pointer"
                >
                  <span>
                    {lang === 'ja'
                      ? '導入・施工相談を予約'
                      : lang === 'en'
                      ? 'Technical & Application Consultation'
                      : 'Tư vấn kỹ thuật & thi công'}
                  </span>
                </button>
              </div>
            </div>

            {/* Inline Quick Order Checkout Form */}
            {(orderOpen || createdOrder) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-4"
              >
                {createdOrder ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {lang === 'ja'
                          ? 'ご注文を受け付けました（管理システム登録済）'
                          : lang === 'en'
                          ? 'Order registered successfully'
                          : 'Đã tạo đơn hàng thành công'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-700 space-y-1">
                      <p>
                        {lang === 'ja' ? '注文番号:' : lang === 'en' ? 'Order code:' : 'Mã đơn hàng:'}{' '}
                        <span className="font-mono font-bold text-slate-900">
                          {createdOrder.code}
                        </span>
                      </p>
                      <p>
                        {createdOrder.productName} · {createdOrder.variant} × {createdOrder.quantity}
                      </p>
                      <p className="font-mono font-semibold text-[#2C64AF] tabular-nums">
                        {createdOrder.totalVnd.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreatedOrder(null)}
                      className="px-4 py-2 text-xs font-semibold text-[#2C64AF] bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      {lang === 'ja' ? '続けて注文する' : lang === 'en' ? 'Place another order' : 'Đặt thêm đơn mới'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleOrderSubmit} className="space-y-3">
                    <div className="text-sm font-bold text-slate-900">
                      {lang === 'ja'
                        ? 'ご注文・配送先情報'
                        : lang === 'en'
                        ? 'Order & Delivery Details'
                        : 'Thông tin đặt hàng & giao nhận'}
                    </div>
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
                        placeholder={lang === 'ja' ? 'お名前 *' : lang === 'en' ? 'Full name *' : 'Họ tên người nhận *'}
                        className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={lang === 'ja' ? '貴社名（任意）' : lang === 'en' ? 'Company (optional)' : 'Tên công ty (nếu có)'}
                        className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email *"
                        className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={lang === 'ja' ? '電話番号 *' : lang === 'en' ? 'Phone number *' : 'Số điện thoại *'}
                        className="px-3 py-2 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder={lang === 'ja' ? 'お届け先住所 *' : lang === 'en' ? 'Shipping address *' : 'Địa chỉ giao hàng *'}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={lang === 'ja' ? '備考（VAT請求書など）' : lang === 'en' ? 'Notes (VAT invoice, delivery time...)' : 'Ghi chú (xuất VAT, thời gian giao...)'}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setOrderOpen(false)}
                        className="px-3.5 py-2 text-xs font-medium text-slate-600 border border-slate-200 bg-white rounded-lg cursor-pointer"
                      >
                        {lang === 'ja' ? 'キャンセル' : lang === 'en' ? 'Cancel' : 'Đóng'}
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer disabled:opacity-60"
                      >
                        {submitting
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
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Kirara-Style Sub-Details Navigation Grid (matching user reference layout) */}
        {subDetails.length > 0 && (
          <section className="mt-14 pt-12 border-t border-slate-200 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#2C64AF] mb-1.5">
                  {lang === 'ja'
                    ? '製品詳細コンテンツ・特集ページ'
                    : lang === 'en'
                    ? 'In-Depth Feature Sub-Pages'
                    : 'Hệ thống trang con chuyên sâu'}
                </div>
                <h2
                  className="text-2xl font-bold tracking-tight text-slate-900"
                  style={{ textWrap: 'balance' }}
                >
                  {lang === 'ja'
                    ? `${name} の詳細情報・機能ガイド (${subDetails.length}項目)`
                    : lang === 'en'
                    ? `Explore Every Aspect of ${name} (${subDetails.length} Guides)`
                    : `Khám phá chi tiết từng khía cạnh của ${name}`}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                {lang === 'ja'
                  ? '各カードをクリックすると、技術データ・FAQ・施工事例などの専用詳細ページへ移動します。'
                  : lang === 'en'
                  ? 'Select any card below to inspect technical data, test metrics, FAQs, or place an online order.'
                  : 'Chọn từng thẻ bên dưới để mở trang thông tin chi tiết, bảng thông số, hỏi đáp và đặt hàng trực tuyến.'}
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-dashed border-slate-300 bg-[#F8FAFC]/70">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {subDetails.map((sub, idx) => {
                  const loc = resolveSubDetailLocale(sub, lang);
                  return (
                    <motion.button
                      key={sub.slug}
                      type="button"
                      onClick={() => onSelectSubDetail(product.id, sub.slug)}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.28, delay: Math.min(idx * 0.03, 0.25), ease: EASE }}
                      className="group relative block aspect-[16/10] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C64AF]"
                    >
                      <ImageWithFallback
                        src={ARTICLE_IMAGES[sub.imageKey]}
                        alt={loc.cardTitle}
                        fallbackTitle={loc.cardTitle}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {/* Measured contrast scrim >= 4.5:1 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/55 to-slate-950/65 group-hover:from-slate-950/35 group-hover:via-slate-950/45 group-hover:to-slate-950/55 transition-colors duration-300" />
                      <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
                        <span
                          className="font-serif text-base sm:text-lg font-medium text-white text-center leading-snug tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
                          style={{ textWrap: 'balance' }}
                        >
                          {loc.cardTitle}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Highlights & Specifications */}
        <div className="mt-14 pt-12 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'ja' ? '主な特長・機能' : lang === 'en' ? 'Key Highlights' : 'Ưu điểm nổi bật'}
            </h2>
            <div className="space-y-3">
              {highlights.map((hl) => (
                <div
                  key={hl}
                  className="flex items-start gap-2.5 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-slate-700"
                >
                  <Check className="w-4 h-4 text-[#2C64AF] shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'ja'
                ? '技術仕様一覧'
                : lang === 'en'
                ? 'Technical Specifications'
                : 'Bảng thông số kỹ thuật'}
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-sm">
              {specs.map((sp) => (
                <div key={sp.label} className="grid grid-cols-1 sm:grid-cols-3">
                  <div className="px-5 py-3.5 bg-[#F8FAFC] font-semibold text-slate-800 sm:border-r border-slate-200">
                    {sp.label}
                  </div>
                  <div className="px-5 py-3.5 text-slate-600 sm:col-span-2 leading-relaxed">
                    {sp.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {lang === 'ja'
              ? '関連製品ラインナップ'
              : lang === 'en'
              ? 'Related Products'
              : 'Sản phẩm liên quan khác'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => {
              const relLoc = resolveProductLocale(rel, lang);
              return (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel.id)}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-slate-50 border-b border-slate-200 overflow-hidden">
                    <ImageWithFallback
                      src={PRODUCT_IMAGES[rel.imageKey]}
                      alt={relLoc.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-[#2C64AF] transition-colors">
                        {relLoc.name}
                      </div>
                      <div className="font-mono text-xs text-slate-500 tabular-nums mt-0.5">
                        {rel.priceLabel}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2C64AF] shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
