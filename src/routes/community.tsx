import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { CommunityGate } from "@/components/community/community-gate";
import { useLocale } from "@/contexts/locale-context";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community | ibo.garden" },
      {
        name: "description",
        content: "GAINE holder community: token-gated chat for Solana wallets with an on-chain GAINE balance.",
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
  const { t } = useLocale();

  return (
    <>
      <PageHeader eyebrow={t("community.eyebrow")} title={t("community.title")} lead={t("community.lead")} />

      <section className="px-6 pb-24">
        <CommunityGate />
      </section>
    </>
  );
}
