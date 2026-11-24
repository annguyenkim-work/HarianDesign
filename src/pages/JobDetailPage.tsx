import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Upload } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { JOBS_EN, JOBS_JA, UI_COPY } from '../i18n/translations';
import { JobApplication, JobPosting } from '../types';

interface JobDetailPageProps {
  job: JobPosting;
  onBackHome: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function JobDetailPage({ job, onBackHome }: JobDetailPageProps) {
  const { lang } = useLanguage();
  const t = UI_COPY[lang].careers;
  const loc =
    lang === 'ja'
      ? JOBS_JA[job.id]
      : lang === 'en'
      ? JOBS_EN[job.id]
      : undefined;

  const title = loc ? loc.title : job.title;
  const department = loc ? loc.department : job.department;
  const location = loc ? loc.location : job.location;
  const employmentType = loc ? loc.employmentType : job.employmentType;
  const summary = loc ? loc.summary : job.summary;
  const responsibilities = loc ? loc.responsibilities : job.responsibilities;
  const requirements = loc ? loc.requirements : job.requirements;
  const benefits = loc ? loc.benefits : job.benefits;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState<string>(t.expOpts[1]);
  const [languageLevel, setLanguageLevel] = useState<string>(t.langOpts[1]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<JobApplication | null>(null);

  useEffect(() => {
    setExperienceYears(t.expOpts[1]);
    setLanguageLevel(t.langOpts[1]);
  }, [lang]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = Math.max(1, Math.round(file.size / 1024));
      setResumeName(`${file.name} (${sizeKb} KB)`);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: title,
          fullName,
          email,
          phone,
          experienceYears,
          languageLevel,
          portfolioUrl,
          resumeName: resumeName || 'CV_Ung_Tuyen.pdf',
          resumeSummary,
          coverLetter,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Error');
        return;
      }
      setReceipt(data as JobApplication);
      setFullName('');
      setEmail('');
      setPhone('');
      setPortfolioUrl('');
      setResumeName('');
      setResumeSummary('');
      setCoverLetter('');
    } catch {
      setFormError(
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
            <span>{lang === 'ja' ? '採用情報' : lang === 'en' ? 'Careers' : 'Tuyển dụng'}</span>
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
                ? '一覧へ戻る'
                : lang === 'en'
                ? 'Back to Home'
                : 'Quay lại trang chủ'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left JD */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                <span className="font-semibold text-[#2C64AF]">{department}</span>
                <span aria-hidden="true">·</span>
                <span>{location}</span>
                <span aria-hidden="true">·</span>
                <span>{employmentType}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 tabular-nums pb-4 border-b border-slate-200">
                <span>{job.salaryRange}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.deadlinePrefix} {job.deadline}
                </span>
              </div>
              <p className="text-base leading-relaxed text-slate-600 mt-4">{summary}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2.5">{t.respTitle}</h2>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                  {responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2.5">{t.reqTitle}</h2>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                  {requirements.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2.5">{t.benTitle}</h2>
                <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
                  {benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Application Form */}
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{t.formTitle}</h2>
            <p className="text-xs text-slate-500 mb-6">{t.formSubtitle}</p>

            {receipt ? (
              <div className="bg-white border border-emerald-200 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.receiptTitle}</span>
                </div>
                <p className="text-sm text-slate-700">
                  {t.receiptCode}{' '}
                  <span className="font-mono font-bold text-slate-900">{receipt.code}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {t.receiptNotePrefix} {receipt.email} {t.receiptNoteSuffix}
                </p>
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] rounded-lg cursor-pointer"
                >
                  {t.applyAnotherBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.fieldFullName}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.placeholderFullName}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
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
                      placeholder="0905 xxx xxx"
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
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
                      placeholder="email@domain.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.fieldExp}
                    </label>
                    <select
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    >
                      {t.expOpts.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.fieldLang}
                    </label>
                    <select
                      value={languageLevel}
                      onChange={(e) => setLanguageLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    >
                      {t.langOpts.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t.fieldPortfolio}
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.fieldCv}
                  </label>
                  <label className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-dashed border-slate-300 hover:border-[#2C64AF] rounded-lg cursor-pointer">
                    <div className="flex items-center gap-2.5 text-sm text-slate-600 truncate">
                      <Upload className="w-4 h-4 text-[#2C64AF] shrink-0" />
                      <span className="truncate">{resumeName || t.cvPlaceholder}</span>
                    </div>
                    <span className="text-xs font-medium text-[#2C64AF] shrink-0">
                      {t.cvUploadBtn}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.fieldSummary}
                  </label>
                  <input
                    type="text"
                    value={resumeSummary}
                    onChange={(e) => setResumeSummary(e.target.value)}
                    placeholder={t.placeholderSummary}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.fieldCover}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder={t.placeholderCover}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] disabled:opacity-60 rounded-lg cursor-pointer"
                >
                  {submitting ? t.submittingBtn : t.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
