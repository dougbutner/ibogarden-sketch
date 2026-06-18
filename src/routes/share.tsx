import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { IbogaShareTool } from "@/components/share/iboga-share-tool";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share Iboga Knowledge | ibo.garden" },
      {
        name: "description",
        content:
          "Invite someone to learn about Iboga. Copy a message, share a link to the knowledge library, or contribute on GitHub.",
      },
      { property: "og:title", content: "Share Iboga Knowledge | ibo.garden" },
      {
        property: "og:description",
        content: "Spread ethical Iboga knowledge: invite friends to the curated learning library.",
      },
    ],
  }),
  component: Share,
});

function Share() {
  return (
    <>
      <PageHeader
        eyebrow="Spread the Root"
        title="Share what you know. Invite someone to learn."
        lead="No individual sponsorship: just open knowledge. Pick a message, copy your invite link to the Iboga library, or share directly to the platforms you already use."
      />

      <section className="px-6 max-w-3xl mx-auto pb-20">
        <IbogaShareTool />
      </section>
    </>
  );
}
