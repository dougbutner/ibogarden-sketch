import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { useLocale } from "@/contexts/locale-context";
import ibogaRoot from "@/assets/iboga-root.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | ibo.garden" },
      {
        name: "description",
        content:
          "Mission, team, and values: ethical, sustainable access to Iboga rooted in Gabonese Bwiti tradition and the Nagoya Protocol.",
      },
      { property: "og:title", content: "About ibo.garden" },
      { property: "og:description", content: "Mission, team, and values rooted in Gabon and Bwiti tradition." },
      { property: "og:image", content: ibogaRoot },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useLocale();

  const team = [
    { name: "Benny Friedmann", role: t("about.roleBenny"), bio: t("about.bioBenny") },
    {
      name: "Douglas Butner",
      role: t("about.roleDouglas"),
      bio: t("about.bioDouglas"),
      orgs: [
        { label: "EASY", href: "https://www.flex.town" },
        { label: "cXc.world", href: "https://cxc.world" },
        { label: "Aquarius Academy", href: "https://aquarius.academy" },
      ],
    },
    {
      name: "Amaka Zazzy, RN, MSN",
      role: t("about.roleAmaka"),
      bio: t("about.bioAmaka"),
      orgs: [{ label: "Wellness 4 the People" }],
    },
    { name: "Gabonese Advisors", role: t("about.roleAdvisors"), bio: t("about.bioAdvisors") },
  ];

  const values = [t("about.value1"), t("about.value2"), t("about.value3"), t("about.value4")];

  return (
    <>
      <PageHeader eyebrow={t("about.eyebrow")} title={t("about.title")} lead={t("about.lead")} />

      <section className="px-6 max-w-7xl mx-auto pb-20 grid md:grid-cols-2 gap-12 items-start">
        <img
          src={ibogaRoot}
          alt={t("about.altRoot")}
          loading="lazy"
          className="rounded-3xl w-full object-cover aspect-[4/5]"
        />
        <div className="space-y-8">
          <div>
            <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">
              {t("about.sacredLabel")}
            </span>
            <h2 className="font-serif text-3xl italic text-forest mt-3 mb-4">{t("about.sacredTitle")}</h2>
            <p className="text-sm text-forest/75 leading-relaxed mb-4">{t("about.sacredP1")}</p>
            <p className="text-sm text-forest/75 leading-relaxed">{t("about.sacredP2")}</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl italic text-forest mb-4">{t("about.valuesTitle")}</h2>
            <ul className="space-y-3 text-forest/80">
              {values.map((v) => (
                <li key={v} className="flex gap-3">
                  <span className="text-gold mt-1">◆</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-bone p-6 rounded-2xl border border-forest/10">
            <h3 className="font-serif text-xl italic text-forest mb-2">{t("about.decreeTitle")}</h3>
            <p className="text-sm text-forest/70 leading-relaxed mb-4">{t("about.decreeBody")}</p>
            <Link to="/decree" className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-deep">
              {t("about.readDecree")}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-forest text-earth">
        <div className="max-w-7xl mx-auto">
          <span className="text-gold text-[11px] font-semibold uppercase tracking-[0.25em]">{t("about.teamEyebrow")}</span>
          <h2 className="font-serif text-4xl md:text-5xl italic mt-4 mb-12">{t("about.teamTitle")}</h2>
          <div className="grid md:grid-cols-2 gap-px bg-earth/10 rounded-2xl overflow-hidden border border-earth/10">
            {team.map((p) => (
              <div key={p.name} className="bg-forest p-8">
                <h3 className="font-serif text-2xl italic text-earth mb-1">{p.name}</h3>
                <p className="text-[11px] text-gold uppercase tracking-widest font-semibold mb-3">{p.role}</p>
                {p.orgs && p.orgs.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.orgs.map((org) => {
                      const href = "href" in org ? org.href : undefined;
                      return href ? (
                        <a
                          key={org.label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] border border-gold/35 text-gold bg-gold/10 hover:opacity-80 transition-opacity"
                        >
                          {org.label}
                        </a>
                      ) : (
                        <span
                          key={org.label}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] border border-gold/35 text-gold bg-gold/10"
                        >
                          {org.label}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
                <p className="text-sm text-earth/70 leading-relaxed">{p.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-3xl mx-auto text-center">
        <p className="text-xs text-forest/50 uppercase tracking-widest">{t("about.disclaimer")}</p>
      </section>
    </>
  );
}
