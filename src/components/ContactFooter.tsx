import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Home, Mail, MapPin, Phone, X } from 'lucide-react';
import { CONSULTING_SERVICES, PRODUCTS } from '../data/catalog';
import { useLanguage } from '../i18n/LanguageContext';
import { PRODUCTS_EN, PRODUCTS_JA, SERVICES_EN, SERVICES_JA, UI_COPY } from '../i18n/translations';
import { ConsultationRequest } from '../types';

interface ContactFooterProps {
  preselectedService: string;
  preselectedProduct: string;
  showContactForm?: boolean;
  onNavigateHomeSection: (sectionId?: string) => void;
  onNavigateAdmin: () => void;
}

export function ContactFooter({
  preselectedService,
  preselectedProduct,
  showContactForm = true,
  onNavigateHomeSection,
  onNavigateAdmin,
}: ContactFooterProps) {
  const { lang } = useLanguage();
  const t = UI_COPY[lang].contact;
  const navT = UI_COPY[lang].nav;

  const localizedServices = CONSULTING_SERVICES.map((sv) =>
    lang === 'ja'
      ? SERVICES_JA[sv.id]?.title || sv.title
      : lang === 'en'
      ? SERVICES_EN[sv.id]?.title || sv.title
      : sv.title
  );

  const localizedProducts = PRODUCTS.map((p) =>
    lang === 'ja'
      ? PRODUCTS_JA[p.id]?.name || p.name
      : lang === 'en'
      ? PRODUCTS_EN[p.id]?.name || p.name
      : p.name
  );

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(
    preselectedService || localizedServices[0]
  );
  const [productInterest, setProductInterest] = useState(
    preselectedProduct || t.noProduct
  );
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState<ConsultationRequest | null>(null);

  const [cookieAccepted, setCookieAccepted] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('harian_cookie_consent') === 'accepted';
    } catch {
      return false;
    }
  });
  const [privacyOpen, setPrivacyOpen] = useState(false);

  function handleAcceptCookie() {
    setCookieAccepted(true);
    try {
      window.localStorage.setItem('harian_cookie_consent', 'accepted');
    } catch {
      // Ignore storage failures in private iframes
    }
  }

  useEffect(() => {
    if (preselectedService) {
      setServiceType(preselectedService);
    } else {
      setServiceType(localizedServices[0]);
    }
  }, [preselectedService, lang]);

  useEffect(() => {
    if (preselectedProduct) {
      setProductInterest(preselectedProduct);
    } else {
      setProductInterest(t.noProduct);
    }
  }, [preselectedProduct, lang]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg(t.errEmail);
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 13) {
      setErrorMsg(t.errPhone);
      return;
    }

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
          serviceType,
          productInterest,
          preferredDate,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error');
        return;
      }
      setConfirmed(data as ConsultationRequest);
      setFullName('');
      setCompanyName('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setMessage('');
    } catch {
      setErrorMsg(
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
    <>
      {showContactForm && (
        <section id="lien-he" className="bg-[#F8FAFC] py-16 lg:py-24 border-b border-slate-200">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#2C64AF] mb-2">{t.kicker}</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                  {t.headline}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">{t.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#2C64AF] shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">{t.officeTitle}</div>
                    <div className="text-slate-600">{t.officeAddr}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.officeLegal}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#2C64AF] shrink-0 mt-1" />
                  <div className="font-mono tabular-nums">
                    <div className="font-semibold text-slate-900 font-sans">{t.hotlineTitle}</div>
                    <div className="text-slate-600">0982 113 488 · 0934 811 819</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#2C64AF] shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900">{t.emailTitle}</div>
                    <div className="text-slate-600">hariancorp.vn@gmail.com</div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://zalo.me/0982113488"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0068FF] bg-white border border-slate-200 hover:border-[#0068FF] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Zalo</span>
                  </a>
                  <a
                    href="https://www.facebook.com/HARIANCorporation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#1877F2] bg-white border border-slate-200 hover:border-[#1877F2] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Facebook</span>
                  </a>
                  <a
                    href="tel:0982113488"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg transition-colors whitespace-nowrap shrink-0 font-mono tabular-nums"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>0982 113 488</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t.formTitle}</h3>
              <p className="text-xs text-slate-500 mb-6">{t.formSubtitle}</p>

              {confirmed ? (
                <div className="p-6 rounded-xl bg-[#F8FAFC] border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t.confirmTitle}</span>
                  </div>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      {t.confirmCode}{' '}
                      <span className="font-mono font-semibold text-slate-900">
                        {confirmed.code}
                      </span>
                    </p>
                    <p>
                      {t.confirmService} {confirmed.serviceType}
                    </p>
                    <p>
                      {t.confirmProduct} {confirmed.productInterest}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmed(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer"
                  >
                    {t.bookAnotherBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldName}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t.placeholderName}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldCompany}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={t.placeholderCompany}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldEmail}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@company.vn"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldPhone}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="09xx xxx xxx"
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldService}
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      >
                        {localizedServices.map((svTitle) => (
                          <option key={svTitle} value={svTitle}>
                            {svTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldProduct}
                      </label>
                      <select
                        value={productInterest}
                        onChange={(e) => setProductInterest(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      >
                        <option value={t.noProduct}>{t.noProduct}</option>
                        {localizedProducts.map((pName) => (
                          <option key={pName} value={pName}>
                            {pName}
                          </option>
                        ))}
                        {preselectedProduct &&
                          !localizedProducts.includes(preselectedProduct) && (
                            <option value={preselectedProduct}>{preselectedProduct}</option>
                          )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldDate}
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t.fieldMessage}
                      </label>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.placeholderMessage}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 text-sm font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                    >
                      {submitting ? t.submittingBtn : t.submitBtn}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Dark Midnight Navy Corporate Footer matching reference screenshot */}
      <footer className="bg-[#071024] text-slate-200 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Brand & Mission Column */}
            <div className="md:col-span-6 space-y-5">
              {/* Crisp HRA · HARIAN CORPORATION Monogram SVG */}
              <button
                type="button"
                onClick={() => onNavigateHomeSection()}
                className="inline-block text-left cursor-pointer focus:outline-none"
                aria-label="Harian Corporation"
              >
                <svg
                  viewBox="0 0 210 56"
                  className="h-12 w-auto"
                  role="img"
                  aria-label="HRA Harian Corporation"
                >
                  {/* White geometric H */}
                  <path
                    d="M6 6h11v14h15V6h11v30H32V26H17v10H6V6z"
                    fill="#FFFFFF"
                  />
                  {/* Gold stylized R */}
                  <path
                    d="M47 6h22c8.2 0 13.5 4.2 13.5 10.7 0 4.6-2.8 8-7.4 9.5l9.4 9.8H71.2l-8.1-8.8H58V36H47V6zm11 8.2v6.6h9.3c2.8 0 4.6-1.3 4.6-3.3 0-2.1-1.8-3.3-4.6-3.3H58z"
                    fill="#FACC15"
                  />
                  {/* White geometric A with Gold inner triangle */}
                  <path
                    d="M94.5 6h12.2l16.8 30h-12.1l-3-5.8H92.8L89.8 36H78.2L94.5 6z"
                    fill="#FFFFFF"
                  />
                  <polygon points="100.6,15.5 95.8,24.8 105.4,24.8" fill="#FACC15" />
                  {/* Wordmark HARIAN CORPORATION */}
                  <text
                    x="6"
                    y="52"
                    fill="#FACC15"
                    fontSize="11.5"
                    fontWeight="700"
                    letterSpacing="2.2"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    HARIAN CORPORATION
                  </text>
                </svg>
              </button>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                {lang === 'ja'
                  ? '日本とベトナム間の投資拡大を総合的に支援し、両国企業の持続的な発展に貢献します。'
                  : lang === 'en'
                  ? 'We provide end-to-end advisory for Japan–Vietnam cross-border investment and sustainable enterprise growth.'
                  : 'Chúng tôi hỗ trợ toàn diện cho việc mở rộng đầu tư giữa Nhật Bản - Việt Nam và góp phần vào việc phát triển của các doanh nghiệp.'}
              </p>
            </div>

            {/* Right Contact Column */}
            <div className="md:col-span-6 md:pl-10 space-y-5">
              <div className="text-xs font-semibold tracking-[0.18em] text-[#FACC15] uppercase">
                {lang === 'ja' ? 'お問い合わせ' : lang === 'en' ? 'CONTACT' : 'LIÊN HỆ'}
              </div>

              <div className="space-y-3.5 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" strokeWidth={1.8} />
                  <span>
                    {lang === 'ja'
                      ? 'Số 83 đường Võ Chí Công, Hoà Xuân, Đà Nẵng, Việt Nam'
                      : lang === 'en'
                      ? '83 Vo Chi Cong Street, Hoa Xuan, Da Nang, Vietnam'
                      : 'Số 83 đường Võ Chí Công, Hoà Xuân Đà Nẵng, Việt Nam'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#FACC15] shrink-0" strokeWidth={1.8} />
                  <a
                    href="mailto:hariancorp.vn@gmail.com"
                    className="hover:text-[#FACC15] transition-colors"
                  >
                    hariancorp.vn@gmail.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#FACC15] shrink-0 mt-1" strokeWidth={1.8} />
                  <div className="flex flex-col gap-0.5 font-mono tabular-nums">
                    <a
                      href="tel:0982113488"
                      className="hover:text-[#FACC15] transition-colors"
                    >
                      0982 113 488
                    </a>
                    <a
                      href="tel:0934811819"
                      className="hover:text-[#FACC15] transition-colors"
                    >
                      0934 811 819
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Square Buttons */}
              <div className="pt-1 flex items-center gap-2.5">
                <a
                  href="https://www.facebook.com/HARIANCorporation"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Harian Corporation"
                  className="w-9 h-9 rounded-md bg-white/[0.06] border border-white/10 hover:border-[#FACC15]/60 hover:bg-white/[0.12] flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                  </svg>
                </a>
                <a
                  href="https://zalo.me/0982113488"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo / Instagram Harian Corporation"
                  className="w-9 h-9 rounded-md bg-white/[0.06] border border-white/10 hover:border-[#FACC15]/60 hover:bg-white/[0.12] flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Subtle Compact Sitemap & Copyright Strip */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <nav aria-label={navT.navAria} className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => onNavigateHomeSection('gioi-thieu')}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {navT.about}
              </button>
              <button
                type="button"
                onClick={() => onNavigateHomeSection('dich-vu')}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {navT.services}
              </button>
              <button
                type="button"
                onClick={() => onNavigateHomeSection('san-pham')}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {navT.products}
              </button>
              <button
                type="button"
                onClick={() => onNavigateHomeSection('tin-tuc')}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.footerNews}
              </button>
              <button
                type="button"
                onClick={() => onNavigateHomeSection('tuyen-dung')}
                className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {navT.careers}
              </button>
              <button
                type="button"
                onClick={onNavigateAdmin}
                className="font-semibold text-[#FACC15] hover:underline whitespace-nowrap cursor-pointer"
              >
                {lang === 'ja'
                  ? '管理ポータル'
                  : lang === 'en'
                  ? 'Admin Portal'
                  : 'Trang quản trị'}
              </button>
            </nav>

            <div className="whitespace-nowrap">© 2026 Harian Corporation</div>
          </div>
        </div>

        {/* Bottom Cookie Consent Strip matching screenshot */}
        {!cookieAccepted && (
          <div className="bg-[#040B1A] border-t border-white/10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed">
                {lang === 'ja'
                  ? '当サイトでは言語設定・ご注文体験向上のためにCookieを使用しています。閲覧を継続することで同意したものとみなされます。 '
                  : lang === 'en'
                  ? 'We use cookies to preserve your language preference, cart state, and browsing experience. By continuing, you agree to our '
                  : 'Website sử dụng cookie để duy trì ngôn ngữ, giỏ hàng và cải thiện trải nghiệm. Tiếp tục sử dụng đồng nghĩa bạn đồng ý. '}
                <button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className="text-[#FACC15] underline hover:text-yellow-300 cursor-pointer"
                >
                  {lang === 'ja'
                    ? 'プライバシーポリシー'
                    : lang === 'en'
                    ? 'Privacy Policy'
                    : 'Bảo mật'}
                </button>
              </p>

              <button
                type="button"
                onClick={handleAcceptCookie}
                className="px-5 py-2 text-xs font-semibold text-white border border-[#FACC15]/50 hover:bg-[#FACC15]/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {lang === 'ja' ? '同意する' : lang === 'en' ? 'Accept' : 'Đồng ý'}
              </button>
            </div>
          </div>
        )}
      </footer>

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPrivacyOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'ja'
                  ? 'プライバシーポリシー・Cookieの利用について'
                  : lang === 'en'
                  ? 'Privacy & Cookie Policy — Harian Corporation'
                  : 'Chính sách Bảo mật & Cookie — Harian Corporation'}
              </h3>
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="p-1.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2.5">
              <p>
                {lang === 'ja'
                  ? 'Harian Corporationは、ウェブサイト上の言語設定（日本語／ベトナム語）、商品のお問い合わせ・注文・採用応募手続きを円滑に行う目的にのみCookieおよび入力データを使用します。'
                  : lang === 'en'
                  ? 'Harian Corporation uses browser storage (Cookies/LocalStorage) solely to remember your selected language (Vietnamese / English / Japanese), maintain session continuity, and process orders, consultations, or career applications.'
                  : 'Công ty Cổ phần Harian chỉ sử dụng bộ nhớ trình duyệt (Cookie/LocalStorage) để duy trì lựa chọn ngôn ngữ (Tiếng Việt / Tiếng Nhật), lưu trạng thái phiên làm việc và hỗ trợ xử lý đơn hàng, tư vấn hoặc hồ sơ ứng tuyển.'}
              </p>
              <p>
                {lang === 'ja'
                  ? 'お客様の個人情報は第三者への販売・共有は一切行いません。'
                  : lang === 'en'
                  ? 'Your contact details are kept strictly confidential and are never sold or shared with unauthorized third parties.'
                  : 'Thông tin liên hệ của quý khách được bảo mật nội bộ và không chia sẻ cho bên thứ ba trái phép.'}
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleAcceptCookie();
                  setPrivacyOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer"
              >
                {lang === 'ja' ? '同意して閉じる' : lang === 'en' ? 'Accept & Close' : 'Đồng ý & Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
