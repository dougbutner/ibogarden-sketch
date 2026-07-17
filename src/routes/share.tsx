import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { IbogaShareTool } from "@/components/share/iboga-share-tool";
import { useLocale } from "@/contexts/locale-context";

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
  const { t } = useLocale();

  return (
    <>
      <PageHeader
        eyebrow={t("share.eyebrow")}
        title={t("share.title")}
        lead={
          <>
            <p className="mb-4">{t("share.lead1")}</p>
            <p className="mb-4">{t("share.lead2")}</p>
            <p>
              {t("share.lead3Before")}{" "}
              <Link to="/community" className="text-gold underline underline-offset-4 hover:text-gold/80">
                {t("share.lead3Link")}
              </Link>{" "}
              {t("share.lead3After")}
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
