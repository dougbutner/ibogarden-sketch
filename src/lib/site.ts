import { SITE_ORIGIN } from "./app-constants";

/** Canonical site origin (no trailing slash). */
export const SITE_URL = SITE_ORIGIN.replace(/\/$/, "");

/** Absolute URL for default Open Graph / Twitter card image. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
