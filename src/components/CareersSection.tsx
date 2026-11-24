import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Upload, Users } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { JOBS_EN, JOBS_JA, UI_COPY } from '../i18n/translations';
import { JobApplication, JobPosting } from '../types';

interface CareersSectionProps {
  jobs: JobPosting[];
  onOpenJobDetail: (jobId: string) => void;
  onOpenAdminHr: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function CareersSection({
  jobs,
  onOpenJobDetail,
  onOpenAdminHr,
}: CareersSectionProps) {
  const { lang } = useLanguage();
  const t = UI_COPY[lang].careers;

  const openJobs = jobs.filter((j) => j.isOpen);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

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
  const [submittedReceipt, setSubmittedReceipt] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (openJobs.length > 0 && !openJobs.some((j) => j.id === selectedJobId)) {
      setSelectedJobId(openJobs[0].id);
    }
  }, [jobs]);

  useEffect(() => {
    setExperienceYears(t.expOpts[1]);
    setLanguageLevel(t.langOpts[1]);
  }, [lang]);

  function getLocalizedJob(job: JobPosting) {
    const loc =
      lang === 'ja'
        ? JOBS_JA[job.id]
        : lang === 'en'
        ? JOBS_EN[job.id]
        : undefined;
    return {
      title: loc ? loc.title : job.title,
      department: loc ? loc.department : job.department,
      location: loc ? loc.location : job.location,
      summary: loc ? loc.summary : job.summary,
      responsibilities: loc ? loc.responsibilities : job.responsibilities,
      requirements: loc ? loc.requirements : job.requirements,
      benefits: loc ? loc.benefits : job.benefits,
    };
  }

  const activeJob = openJobs.find((j) => j.id === selectedJobId) || openJobs[0];
  const activeJobLoc = activeJob ? getLocalizedJob(activeJob) : null;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKb = Math.max(1, Math.round(file.size / 1024));
      setResumeName(`${file.name} (${sizeKb} KB)`);
    }
  }

  async function handleSubmitApplication(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setFormError(t.errEmail);
      return;
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 13) {
      setFormError(t.errPhone);
      return;
    }
    if (coverLetter.trim().length < 15) {
      setFormError(t.errCover);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: activeJob?.id || 'general',
          jobTitle: activeJobLoc?.title || 'General Application',
          fullName,
          email,
          phone,
          experienceYears,
          languageLevel,
          portfolioUrl,
          resumeName: resumeName || 'Ho_so_dinh_kem_truc_tuyen.pdf',
          resumeSummary,
          coverLetter,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Error');
        return;
      }

      setSubmittedReceipt(data as JobApplication);
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
          ? 'Connection error while submitting application.'
          : 'Lỗi kết nối khi gửi hồ sơ.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="tuyen-dung" className="bg-white border-b border-slate-200/80 py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-[#2C64AF] mb-2">{t.kicker}</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t.headline}
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenAdminHr}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#2C64AF] bg-white border border-slate-200 hover:border-[#2C64AF] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.tabHr}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Open Positions & JD Preview */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              {openJobs.map((job, idx) => {
                const selected = activeJob?.id === job.id;
                const loc = getLocalizedJob(job);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.25, delay: idx * 0.05, ease: EASE }}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setSubmittedReceipt(null);
                    }}
                    className={`w-full text-left p-5 rounded-xl border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#F8FAFC] border-[#2C64AF]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                          <span className="font-medium text-[#2C64AF]">{loc.department}</span>
                          <span aria-hidden="true">·</span>
                          <span>{loc.location}</span>
                        </div>
                        <div className="text-base font-semibold text-slate-900 mb-1.5">
                          {loc.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-mono tabular-nums">
                          <span>{job.salaryRange}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {t.deadlinePrefix} {job.deadline}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenJobDetail(job.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#2C64AF] bg-white border border-slate-200 hover:border-[#2C64AF] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>{lang === 'ja' ? '詳細' : lang === 'en' ? 'Details' : 'Chi tiết'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {activeJob && activeJobLoc && (
              <div className="p-6 rounded-xl border border-slate-200 bg-[#F8FAFC] space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {activeJobLoc.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {activeJobLoc.summary}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-800 mb-2">{t.respTitle}</h4>
                  <ul className="space-y-1.5 text-sm text-slate-600 list-disc pl-4">
                    {activeJobLoc.responsibilities.slice(0, 3).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenJobDetail(activeJob.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2C64AF] hover:underline cursor-pointer"
                  >
                    <span>
                      {lang === 'ja'
                        ? '募集要項の全文ページを見る →'
                        : lang === 'en'
                        ? 'View full job description →'
                        : 'Xem trang mô tả công việc đầy đủ →'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Professional Job Application Form */}
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">{t.formTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.formSubtitle}</p>
            </div>

            {submittedReceipt ? (
              <div className="bg-white border border-emerald-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.receiptTitle}</span>
                </div>
                <div className="text-sm text-slate-700 space-y-1.5">
                  <p>
                    {t.receiptCode}{' '}
                    <span className="font-mono font-semibold text-slate-900">
                      {submittedReceipt.code}
                    </span>
                  </p>
                  <p>
                    {t.receiptCandidate} {submittedReceipt.fullName}
                  </p>
                  <p>
                    {t.receiptRole} {submittedReceipt.jobTitle}
                  </p>
                  <p className="text-xs text-slate-500 pt-1">
                    {t.receiptNotePrefix} {submittedReceipt.email} {t.receiptNoteSuffix}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmittedReceipt(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] rounded-lg cursor-pointer"
                  >
                    {t.applyAnotherBtn}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdminHr}
                    className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    {t.viewHrBtn}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                {formError && (
                  <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.fieldPosition}
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#2C64AF]"
                  >
                    {openJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {getLocalizedJob(job).title}
                      </option>
                    ))}
                  </select>
                </div>

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
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#2C64AF]"
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
                  <label className="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-dashed border-slate-300 hover:border-[#2C64AF] rounded-lg cursor-pointer transition-colors">
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
                  className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#2C64AF] hover:bg-[#1E4B8A] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  {submitting ? t.submittingBtn : t.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
