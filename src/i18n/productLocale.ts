import {
  LocalizedProductContent,
  ProductItem,
  ProductSpec,
  ProductSubDetail,
  ProductSubDetailLocale,
} from '../types';
import { Language } from './LanguageContext';
import { PRODUCTS_EN, PRODUCTS_JA } from './translations';

export interface ResolvedProductLocale {
  name: string;
  subtitle: string;
  category: string;
  stockLabel: string;
  origin: string;
  summary: string;
  variants: string[];
  highlights: string[];
  specs: ProductSpec[];
}

function nonEmptyStr(val: string | undefined): string | undefined {
  return typeof val === 'string' && val.trim().length > 0 ? val : undefined;
}

function nonEmptyArr<T>(arr: T[] | undefined): T[] | undefined {
  return Array.isArray(arr) && arr.length > 0 ? arr : undefined;
}

export function resolveProductLocale(
  product: ProductItem,
  lang: Language
): ResolvedProductLocale {
  const custom: LocalizedProductContent | undefined = product.translations?.[lang];
  const staticDict =
    lang === 'en'
      ? PRODUCTS_EN[product.id]
      : lang === 'ja'
      ? PRODUCTS_JA[product.id]
      : undefined;

  const viCustom = product.translations?.vi;

  const baseName = nonEmptyStr(viCustom?.name) || product.name;
  const baseSubtitle = nonEmptyStr(viCustom?.subtitle) || product.subtitle;
  const baseCategory = nonEmptyStr(viCustom?.category) || product.category;
  const baseStockLabel = nonEmptyStr(viCustom?.stockLabel) || product.stockLabel;
  const baseOrigin = nonEmptyStr(viCustom?.origin) || product.origin;
  const baseSummary = nonEmptyStr(viCustom?.summary) || product.summary;
  const baseVariants = nonEmptyArr(viCustom?.variants) || product.variants;
  const baseHighlights = nonEmptyArr(viCustom?.highlights) || product.highlights;
  const baseSpecs = nonEmptyArr(viCustom?.specs) || product.specs;

  if (lang === 'vi') {
    return {
      name: baseName,
      subtitle: baseSubtitle,
      category: baseCategory,
      stockLabel: baseStockLabel,
      origin: baseOrigin,
      summary: baseSummary,
      variants: baseVariants,
      highlights: baseHighlights,
      specs: baseSpecs,
    };
  }

  return {
    name: nonEmptyStr(custom?.name) || nonEmptyStr(staticDict?.name) || baseName,
    subtitle: nonEmptyStr(custom?.subtitle) || nonEmptyStr(staticDict?.subtitle) || baseSubtitle,
    category: nonEmptyStr(custom?.category) || nonEmptyStr(staticDict?.category) || baseCategory,
    stockLabel:
      nonEmptyStr(custom?.stockLabel) || nonEmptyStr(staticDict?.stockLabel) || baseStockLabel,
    origin: nonEmptyStr(custom?.origin) || nonEmptyStr(staticDict?.origin) || baseOrigin,
    summary: nonEmptyStr(custom?.summary) || nonEmptyStr(staticDict?.summary) || baseSummary,
    variants: nonEmptyArr(custom?.variants) || nonEmptyArr(staticDict?.variants) || baseVariants,
    highlights:
      nonEmptyArr(custom?.highlights) || nonEmptyArr(staticDict?.highlights) || baseHighlights,
    specs: nonEmptyArr(custom?.specs) || nonEmptyArr(staticDict?.specs) || baseSpecs,
  };
}

export function resolveSubDetailLocale(
  sub: ProductSubDetail,
  lang: Language
): ProductSubDetailLocale {
  const target = lang === 'en' ? sub.en : lang === 'ja' ? sub.ja : sub.vi;
  if (target && target.cardTitle && target.cardTitle.trim().length > 0) {
    return {
      ...sub.vi,
      ...target,
      pageTitle: nonEmptyStr(target.pageTitle) || sub.vi.pageTitle,
      eyebrow: nonEmptyStr(target.eyebrow) || sub.vi.eyebrow,
      lead: nonEmptyStr(target.lead) || sub.vi.lead,
      sections:
        Array.isArray(target.sections) && target.sections.length > 0
          ? target.sections
          : sub.vi.sections,
      metrics:
        Array.isArray(target.metrics) && target.metrics.length > 0
          ? target.metrics
          : sub.vi.metrics,
      comparisonHeaders: target.comparisonHeaders || sub.vi.comparisonHeaders,
      comparisonRows:
        Array.isArray(target.comparisonRows) && target.comparisonRows.length > 0
          ? target.comparisonRows
          : sub.vi.comparisonRows,
      faqs: Array.isArray(target.faqs) && target.faqs.length > 0 ? target.faqs : sub.vi.faqs,
      examples:
        Array.isArray(target.examples) && target.examples.length > 0
          ? target.examples
          : sub.vi.examples,
    };
  }
  return sub.vi;
}
