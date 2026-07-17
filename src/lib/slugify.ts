/** URL-safe slug from a title string. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "article";
}

/** Ensure slug uniqueness within a category prefix. */
export function dedupeSlug(seen: Set<string>, categoryId: string, base: string): string {
  let slug = base;
  let n = 2;
  const key = () => `${categoryId}/${slug}`;
  while (seen.has(key())) {
    slug = `${base}-${n}`;
    n += 1;
  }
  seen.add(key());
  return slug;
}
