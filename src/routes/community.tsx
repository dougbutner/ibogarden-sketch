import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { CommunityGate } from "@/components/community/community-gate";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community | ibo.garden" },
      {
        name: "description",
        content:
          "GAINE holder community: token-gated chat and dialogue for verified Solana wallet holders.",
      },
      { property: "og:title", content: "ibo.garden Community" },
      {
        property: "og:description",
        content: "Token-gated community space for GAINE holders on Solana.",
      },
    ],
  }),
  component: Community,
});

function Community() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="A forest of voices."
        lead={
          <>
            A secret area for <span className="gaine-word gaine-word-sm">GAINE</span> holders. Connect your
            Solana wallet to verify on-chain balance and enter the holder chat.
          </>
        }
      />

      <section className="px-6 pb-24">
        <CommunityGate />
      </section>
    </>
  );
}
