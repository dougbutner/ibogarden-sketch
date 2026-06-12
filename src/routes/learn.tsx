import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { ArticleCategoryList } from "@/components/knowledge/article-category-list";
import { IbogaTopicGraph } from "@/components/knowledge/iboga-topic-graph";
import { VideoJourneys } from "@/components/knowledge/video-journeys";
import { ARTICLE_CATEGORIES, VIDEO_PLAYLISTS } from "@/data/knowledge-iboga";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Knowledge — Iboga — ibo.garden" },
      {
        name: "description",
        content:
          "Iboga video journeys, medical and healing articles, tradition, conservation, and research. Curated knowledge on Tabernanthe iboga.",
      },
      { property: "og:title", content: "Knowledge — Iboga — ibo.garden" },
      {
        property: "og:description",
        content: "Video journeys, topic map, and curated articles on Iboga Tabernanthe.",
      },
    ],
  }),
  component: Learn,
});

function Learn() {
  return (
    <>
      <PageHeader eyebrow="Knowledge" title="Iboga">
        <p className="text-sm text-forest/55 italic mt-6 border-l-2 border-gold/40 pl-4 max-w-xl">
          Note from the team.
        </p>
        <div className="mt-8 space-y-2 max-w-2xl">
          <p className="text-lg md:text-xl text-forest/80 leading-relaxed font-serif italic">
            Understanding is the medicine.
          </p>
          <p className="text-lg md:text-xl text-forest/70 leading-relaxed">
            The dreamlike reality awaits those who taste the root.
          </p>
          <p className="text-base md:text-lg text-forest/65 leading-relaxed">
            If you are called to iboga, you may discover why in these videos.
          </p>
        </div>
      </PageHeader>

      <section className="px-6 max-w-7xl mx-auto pb-20">
        <h2 className="font-serif text-3xl italic text-forest mb-8">Video Journeys</h2>
        <VideoJourneys playlists={VIDEO_PLAYLISTS} />
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-12">
        <IbogaTopicGraph />
      </section>

      <section className="px-6 max-w-7xl mx-auto pb-24">
        <h2 className="font-serif text-3xl italic text-forest mb-8">Iboga Articles</h2>
        <ArticleCategoryList categories={ARTICLE_CATEGORIES} />
        <p className="mt-10 text-xs text-forest/45 italic max-w-2xl leading-relaxed">
          Even with recent microdosing papers, rigorous iboga and ibogaine microdosing trials remain scarce.
          Peer-reviewed evidence today centers on single flood-dose protocols. Funding the research drug companies
          won't is a genuine open frontier — not settled science.
        </p>
      </section>
    </>
  );
}
