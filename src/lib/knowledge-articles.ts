import type { Locale } from "@/data/i18n";
import { ARTICLE_CATEGORIES, getArticleCategories, type ArticleCategory, type KnowledgeLink } from "@/data/knowledge-iboga";
import { dedupeSlug, slugify } from "@/lib/slugify";

export type ArticleEntry = KnowledgeLink & {
  slug: string;
  categoryId: string;
  categoryTitle: string;
};

/**
 * Slugs are always derived from the canonical English titles so URLs stay stable
 * across locales. Never build this catalog from a localized category list.
 */
function buildCatalog(): ArticleEntry[] {
  const entries: ArticleEntry[] = [];
  const seen = new Set<string>();

  for (const category of ARTICLE_CATEGORIES) {
    for (const article of category.articles) {
      const slug = dedupeSlug(seen, category.id, slugify(article.title));
      entries.push({
        ...article,
        slug,
        categoryId: category.id,
        categoryTitle: category.title,
      });
    }
  }

  return entries;
}

const CATALOG = buildCatalog();

export function getAllArticles(): ArticleEntry[] {
  return CATALOG;
}

/** Overlay localized title/description (looked up by stable href) onto a canonical entry. */
function localizeEntry(entry: ArticleEntry, locale: Locale): ArticleEntry {
  if (locale === "en") return entry;
  const category = getArticleCategories(locale).find((c) => c.id === entry.categoryId);
  const localized = category?.articles.find((a) => a.href === entry.href);
  if (!localized) return entry;
  return {
    ...entry,
    title: localized.title,
    description: localized.description,
    categoryTitle: category?.title ?? entry.categoryTitle,
  };
}

export function getArticle(
  categoryId: string,
  articleSlug: string,
  locale: Locale = "en",
): ArticleEntry | undefined {
  const entry = CATALOG.find((a) => a.categoryId === categoryId && a.slug === articleSlug);
  return entry ? localizeEntry(entry, locale) : undefined;
}

export function findArticleByHref(categoryId: string, href: string): ArticleEntry | undefined {
  return CATALOG.find((a) => a.categoryId === categoryId && a.href === href);
}

export function getArticleCategory(categoryId: string, locale: Locale = "en"): ArticleCategory | undefined {
  return getArticleCategories(locale).find((c) => c.id === categoryId);
}

export function articlePath(categoryId: string, articleSlug: string): string {
  return `/learn/${categoryId}/${articleSlug}`;
}
