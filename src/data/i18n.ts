import { en } from "@/data/locales/en";
import { fr } from "@/data/locales/fr";

export type Locale = "en" | "fr";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const messages = { en, fr: fr as unknown as typeof en };

type MessageTree = typeof en;

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

function format(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  );
}

export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const raw =
    getNestedValue(messages[locale] as Record<string, unknown>, key) ??
    getNestedValue(messages.en as Record<string, unknown>, key) ??
    key;
  return format(raw, vars);
}

/** Pick locale-specific structured data with English fallback. */
export function pickLocale<T>(locale: Locale, map: { en: T; fr: T }): T {
  return map[locale] ?? map.en;
}

export type { MessageTree };
