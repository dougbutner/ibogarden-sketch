import { createFileRoute, Link } from "@tanstack/react-router";
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
        eyebrow="Rooted in Connection"
        title="Share the Root."
        lead={
          <>
            <p className="mb-4">
              I hope you learned something here. It&apos;s my pleasure to guide you to something that&apos;s healed me
              and many I love.
            </p>
            <p className="mb-4">
              Now you can easily share this site as a resource for others to learn about Iboga.
            </p>
            <p>
              If you have purchased GAINE you can access a secret area in{" "}
              <Link to="/community" className="text-gold underline underline-offset-4 hover:text-gold/80">
                community
              </Link>{" "}
              token-gated for holders.
            </p>
          </>
        }
      />

      <section className="px-6 max-w-3xl mx-auto pb-20">
        <IbogaShareTool />
      </section>
    </>
  );
}
