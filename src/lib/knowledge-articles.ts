import { ARTICLE_CATEGORIES, type ArticleCategory, type KnowledgeLink } from "@/data/knowledge-iboga";

export type ArticleEntry = KnowledgeLink & {
  slug: string;
  categoryId: string;
  categoryTitle: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildCatalog(): ArticleEntry[] {
  const entries: ArticleEntry[] = [];
  const seen = new Set<string>();

  for (const category of ARTICLE_CATEGORIES) {
    for (const article of category.articles) {
      let base = slugify(article.title);
      let slug = base;
      let n = 2;
      while (seen.has(`${category.id}/${slug}`)) {
        slug = `${base}-${n++}`;
      }
      seen.add(`${category.id}/${slug}`);
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

export function getArticle(categoryId: string, articleSlug: string): ArticleEntry | undefined {
  return CATALOG.find((a) => a.categoryId === categoryId && a.slug === articleSlug);
}

export function findArticleByHref(categoryId: string, href: string): ArticleEntry | undefined {
  return CATALOG.find((a) => a.categoryId === categoryId && a.href === href);
}

export function getArticleCategory(categoryId: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORIES.find((c) => c.id === categoryId);
}

export function articlePath(categoryId: string, articleSlug: string): string {
  return `/learn/${categoryId}/${articleSlug}`;
}
