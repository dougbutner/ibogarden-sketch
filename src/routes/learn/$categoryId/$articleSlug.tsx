import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useLocale } from "@/contexts/locale-context";
import { articlePath, getArticle, getArticleCategory } from "@/lib/knowledge-articles";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/site";

export const Route = createFileRoute("/learn/$categoryId/$articleSlug")({
  loader: ({ params }) => {
    const article = getArticle(params.categoryId, params.articleSlug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    if (!article) return {};
    const title = `${article.title} | ibo.garden Knowledge`;
    const description = article.description;
    const url = absoluteUrl(articlePath(article.categoryId, article.slug));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
    };
  },
  component: LearnArticle,
});

function LearnArticle() {
  const { article } = Route.useLoaderData();
  const { t, locale } = useLocale();
  const localized = getArticle(article.categoryId, article.slug, locale) ?? article;
  const category = getArticleCategory(article.categoryId, locale);

  return (
    <>
      <PageHeader
        eyebrow={category?.title ?? t("article.knowledge")}
        title={localized.title}
        lead={localized.description}
      />

      <section className="px-6 pb-24 max-w-3xl mx-auto">
        <nav className="mb-10 text-sm text-forest/55">
          <Link to="/learn" className="hover:text-gold transition-colors">
            {t("article.back")}
          </Link>
        </nav>

        <div className="bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
          {localized.source ? (
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-deep mb-6">
              {localized.source}
            </span>
          ) : null}

          <p className="text-forest/75 leading-relaxed mb-8">{localized.description}</p>

          <p className="text-sm text-forest/55 mb-8 leading-relaxed">{t("article.hostedNote")}</p>

          <a
            href={localized.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-forest text-earth px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors"
          >
            {t("article.readAtSourceArrow")}
          </a>
        </div>

        <p className="mt-8 text-xs text-forest/45 italic leading-relaxed">
          {t("article.externalLink")}:{" "}
          <a href={localized.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
            {localized.href}
          </a>
        </p>
      </section>
    </>
  );
}
