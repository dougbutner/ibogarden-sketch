import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/page-header";
import { CommunityGate } from "@/components/community/community-gate";

export const Route = createFileRoute("/community")({
  validateSearch: (search: Record<string, unknown>) => ({
    oauth: typeof search.oauth === "string" ? search.oauth : undefined,
  }),
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
  const { oauth } = Route.useSearch();

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

      {oauth === "success" ? (
        <div className="px-6 max-w-lg mx-auto -mt-6 mb-6">
          <p className="text-sm text-forest bg-gold/10 border border-gold/30 rounded-xl px-4 py-3">
            Signed in with Google. Connect your wallet and hold GAINE to unlock holder chat.
          </p>
        </div>
      ) : null}
      {oauth === "error" ? (
        <div className="px-6 max-w-lg mx-auto -mt-6 mb-6">
          <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            Google sign-in failed. Try again or use wallet login.
          </p>
        </div>
      ) : null}

      <section className="px-6 pb-24">
        <CommunityGate />
      </section>
    </>
  );
}
