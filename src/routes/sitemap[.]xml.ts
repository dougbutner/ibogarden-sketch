import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { getAllArticles, articlePath } from "@/lib/knowledge-articles";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/source",
  "/learn",
  "/find",
  "/marketplace",
  "/network",
  "/gaine",
  "/share",
  "/impact",
  "/community",
  "/decree",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const articleRoutes = getAllArticles().map((a) => articlePath(a.categoryId, a.slug));
        const urls = [...STATIC_ROUTES, ...articleRoutes]
          .map((p) => `  <url><loc>${SITE_URL}${p}</loc><changefreq>weekly</changefreq></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
