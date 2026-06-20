/** Canonical site origin (no trailing slash). Override with VITE_SITE_URL in env. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://ibo.garden"
).replace(/\/$/, "");

/** Absolute URL for default Open Graph / Twitter card image. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
