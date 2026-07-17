import { pickLocale, type Locale } from "@/data/i18n";
import { en } from "@/data/locales/en";
import { fr } from "@/data/locales/fr";

const FOOTER_LEGAL: { en: string[]; fr: string[] } = {
  en: [en.legal.p0, en.legal.p1, en.legal.p2, en.legal.p3],
  fr: [fr.legal.p0, fr.legal.p1, fr.legal.p2, fr.legal.p3],
};

export function getFooterLegal(locale: Locale) {
  return pickLocale(locale, FOOTER_LEGAL);
}

/** @deprecated Prefer getFooterLegal(locale) */
export const FOOTER_LEGAL_PARAGRAPHS = FOOTER_LEGAL.en;
