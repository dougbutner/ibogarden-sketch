import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ArticleCategoryList } from "@/components/knowledge/article-category-list";
import { IbogaTopicGraph } from "@/components/knowledge/iboga-topic-graph";
import { VideoJourneys } from "@/components/knowledge/video-journeys";
import { useLocale } from "@/contexts/locale-context";
import { getArticleCategories, getVideoPlaylists } from "@/data/knowledge-iboga";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Knowledge: Iboga | ibo.garden" },
      {
        name: "description",
        content:
          "Iboga video journeys, medical and healing articles, tradition, conservation, and research. Curated knowledge on Tabernanthe iboga.",
      },
      { property: "og:title", content: "Knowledge: Iboga | ibo.garden" },
      {
        property: "og:description",
        content: "Video journeys, topic map, and curated articles on Iboga Tabernanthe.",
      },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { t, locale } = useLocale();
  const playlists = getVideoPlaylists(locale);
  const categories = getArticleCategories(locale);

  return (
    <>
      <PageHeader eyebrow={t("learn.eyebrow")} title={t("learn.title")}>
        <p className="text-lg md:text-xl text-forest/80 leading-relaxed font-serif italic mt-6 max-w-2xl">
          {t("learn.intro")}
        </p>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-20">
        <VideoJourneys playlists={playlists} />
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-12">
        <IbogaTopicGraph />
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-24">
        <h2 className="font-serif text-3xl italic text-forest mb-8">{t("learn.articlesTitle")}</h2>
        <ArticleCategoryList categories={categories} />
        <p className="mt-10 text-xs text-forest/45 italic max-w-2xl leading-relaxed">{t("learn.caveat")}</p>
      </section>
    </>
  );
}
