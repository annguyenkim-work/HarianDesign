import { FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { CONSULTING_SERVICES } from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import { SERVICES_EN, SERVICES_JA } from '../i18n/translations';
import { ConsultingService, ConsultationRequest } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { withBase } from '../utils/assetUrl';

interface ServiceDetailPageProps {
  service: ConsultingService;
  onBackHome: () => void;
  onSelectService: (id: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const PROCESS_STEPS = {
  vi: [
    {
      step: '01',
      title: 'Khảo sát & Tiếp nhận mục tiêu',
      desc: 'Lắng nghe bài toán đầu tư, hiện trạng vận hành doanh nghiệp hoặc đo đạc trực tiếp chất lượng không khí tại công trình.',
    },
    {
      step: '02',
      title: 'Thiết kế phương án chuẩn Nhật',
      desc: 'Đề xuất lộ trình chiến lược, cấu trúc pháp lý – thuế hoặc giải pháp vật liệu khoáng chất Kirara tối ưu ngân sách.',
    },
    {
      step: '03',
      title: 'Triển khai & Giám sát kỹ thuật',
      desc: 'Đội ngũ chuyên gia song ngữ Việt – Nhật và kỹ thuật viên Wall Artist trực tiếp thực thi đúng tiến độ cam kết.',
    },
    {
      step: '04',
      title: 'Nghiệm thu & Đồng hành dài hạn',
      desc: 'Bàn giao kết quả định lượng, hướng dẫn vận hành và hỗ trợ hậu mãi xuyên suốt quá trình phát triển.',
    },
  ],
  ja: [
    {
      step: '01',
      title: 'ヒアリング・現地調査',
      desc: '企業の経営課題やベトナム進出計画のヒアリング、または対象施設の室内空気環境・壁面状態を精査します。',
    },
    {
      step: '02',
      title: '日本基準の最適プラン策定',
      desc: '法務・税務スキームや最適な投資戦略、またはキララ自然鉱物施工の費用対効果の高いプランをご提案します。',
    },
    {
      step: '03',
      title: '専門チームによる実行支援',
      desc: '日越バイリンガルコンサルタントおよび認定ウォールアーティストが計画通りかつ高精度に実行します。',
    },
    {
      step: '04',
      title: '完了検証・継続サポート',
      desc: '定量的データに基づく完了確認とアフターフォローを通じて、長期的な事業成長と快適な空間を支えます。',
    },
  ],
  en: [
    {
      step: '01',
      title: 'Discovery & On-Site Survey',
      desc: 'Review business expansion goals, operational challenges, or measure indoor air quality and wall conditions directly on-site.',
    },
    {
      step: '02',
      title: 'Japanese-Standard Solution Design',
      desc: 'Propose an actionable legal-tax roadmap, investment structure, or cost-effective Kirara mineral application plan.',
    },
    {
      step: '03',
      title: 'Execution & Technical Supervision',
      desc: 'Bilingual consultants and certified Wall Artists execute every milestone accurately on schedule.',
    },
    {
      step: '04',
      title: 'Handover & Long-Term Support',
      desc: 'Deliver measurable handover metrics, operational guidance, and ongoing after-sales advisory.',
    },
  ],
};

export function ServiceDetailPage({
  service,
  onBackHome,
  onSelectService,
}: ServiceDetailPageProps) {
  const { lang } = useLanguage();
  const loc =
    lang === 'ja'
      ? SERVICES_JA[service.id]
      : lang === 'en'
      ? SERVICES_EN[service.id]
      : undefined;

  const title = loc ? loc.title : service.title;
  const category = loc ? loc.category : service.category;
  const priceLabel = loc ? loc.priceLabel : service.priceLabel;
  const summary = loc ? loc.summary : service.summary;
  const deliverables = loc ? loc.deliverables : service.deliverables;

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [booked, setBooked] = useState<ConsultationRequest | null>(null);

  const otherServices = CONSULTING_SERVICES.filter((s) => s.id !== service.id);

  async function handleBookService(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          phone,
          serviceType: title,
          productInterest:
            lang === 'ja'
              ? '選択中のサービスに準拠'
              : lang === 'en'
              ? 'Per selected service'
              : 'Theo dịch vụ đã chọn',
          preferredDate,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error');
        return;
      }
      setBooked(data as ConsultationRequest);
      setFullName('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setMessage('');
    } catch {
      setErrorMsg(
        lang === 'ja'
          ? '送信エラーが発生しました。'
          : lang === 'en'
          ? 'Connection error. Please try again.'
          : 'Lỗi kết nối.'
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
            <span>{lang === 'ja' ? '事業内容' : lang === 'en' ? 'Services' : 'Dịch vụ'}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium">{title}</span>
          </div>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#2C64AF] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {lang === 'ja'
                ? 'トップへ戻る'
                : lang === 'en'
                ? 'Back to Home'
                : 'Quay lại trang chủ'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="font-mono font-semibold text-[#2C64AF] tabular-nums">
                  {service.index}.
                </span>
                <span aria-hidden="true">·</span>
                <span>{category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{priceLabel}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
                {title}
              </h1>
              <p className="font-serif text-lg leading-relaxed text-slate-600">{summary}</p>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <ImageWithFallback
                src={
                  service.category === 'Tư vấn doanh nghiệp'
                    ? withBase('/src/assets/images/consulting_architecture_1794973825429.jpg')
                    : withBase('/src/assets/images/hero_mineral_living_1794973824082.jpg')
                }
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {lang === 'ja'
                  ? '具体的な提供範囲'
                  : lang === 'en'
                  ? 'Key Deliverables & Scope'
                  : 'Hạng mục triển khai chi tiết'}
              </h2>
              <div className="space-y-3">
                {deliverables.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-slate-700"
                  >
                    <Check className="w-4 h-4 text-[#2C64AF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {lang === 'ja'
                  ? '導入・コンサルティングの流れ'
                  : lang === 'en'
                  ? '4-Step Engagement Process'
                  : 'Quy trình thực hiện 4 bước'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROCESS_STEPS[lang].map((st) => (
                  <div
                    key={st.step}
                    className="p-5 rounded-xl border border-slate-200 bg-white space-y-2"
                  >
                    <div className="font-mono text-xs font-semibold text-[#2C64AF] tabular-nums">
                      {st.step}.
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-600">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Booking Form */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'ja'
                  ? 'このサービスの相談を予約'
                  : lang === 'en'
                  ? 'Book Consultation for This Service'
                  : 'Đặt lịch tư vấn dịch vụ này'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ja'
                  ? 'ご担当者様へ直接ご連絡いたします。'
                  : lang === 'en'
                  ? 'A Harian specialist will follow up within one business day.'
                  : 'Chuyên viên Harian sẽ liên hệ xác nhận trong ngày làm việc.'}
              </p>
            </div>

            {booked ? (
              <div className="p-5 rounded-xl bg-white border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {lang === 'ja'
                      ? '予約を受け付けました'
                      : lang === 'en'
                      ? 'Consultation Request Confirmed'
                      : 'Đã ghi nhận lịch hẹn tư vấn'}
                  </span>
                </div>
                <p className="text-sm text-slate-700">
                  {lang === 'ja' ? '受付番号:' : lang === 'en' ? 'Reference code:' : 'Mã hồ sơ:'}{' '}
                  <span className="font-mono font-bold text-slate-900">{booked.code}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setBooked(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#2C64AF] border border-slate-200 rounded-lg cursor-pointer"
                >
                  {lang === 'ja'
                    ? '別の相談を送る'
                    : lang === 'en'
                    ? 'Submit another inquiry'
                    : 'Gửi thêm yêu cầu khác'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookService} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'ja' ? 'お名前 *' : lang === 'en' ? 'Full name *' : 'Họ và tên *'}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={
                    lang === 'ja'
                      ? '貴社名（任意）'
                      : lang === 'en'
                      ? 'Company / Organization'
                      : 'Doanh nghiệp / Tổ chức'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={lang === 'ja' ? '電話番号 *' : lang === 'en' ? 'Phone number *' : 'Số điện thoại *'}
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === 'ja'
                      ? 'ご相談内容の詳細をお書きください...'
                      : lang === 'en'
                      ? 'Describe your project scope or site area...'
                      : 'Mô tả nhu cầu tư vấn hoặc diện tích công trình...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer disabled:opacity-60"
                >
                  {submitting
                    ? lang === 'ja'
                      ? '送信中...'
                      : lang === 'en'
                      ? 'Submitting...'
                      : 'Đang gửi...'
                    : lang === 'ja'
                    ? '相談を予約する'
                    : lang === 'en'
                    ? 'Confirm Consultation Booking'
                    : 'Xác nhận đặt lịch tư vấn'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Other Services */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {lang === 'ja'
              ? 'その他のサービス'
              : lang === 'en'
              ? 'Explore Other Harian Services'
              : 'Các dịch vụ khác tại Harian'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherServices.map((sv) => {
              const svLoc =
                lang === 'ja'
                  ? SERVICES_JA[sv.id]
                  : lang === 'en'
                  ? SERVICES_EN[sv.id]
                  : undefined;
              return (
                <button
                  key={sv.id}
                  type="button"
                  onClick={() => onSelectService(sv.id)}
                  className="text-left p-5 rounded-xl border border-slate-200 hover:border-[#2C64AF] bg-white transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-mono text-[#2C64AF] mb-1">
                      {sv.index}. · {svLoc ? svLoc.category : sv.category}
                    </div>
                    <div className="font-semibold text-slate-900">
                      {svLoc ? svLoc.title : sv.title}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
