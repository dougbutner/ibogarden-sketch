"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocale } from "@/contexts/locale-context";

export function GaineMoneyModel() {
  const { t } = useLocale();

  return (
    <Collapsible className="mt-8 max-w-2xl w-full mx-auto text-left">
      <div className="flex items-center justify-center gap-3">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--gaine-accent)" }}
        >
          {t("gaineUi.moneyModelHeading")}
        </p>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gaine-accent)] data-[state=open]:rotate-45"
            style={{ borderColor: "var(--gaine-border)", color: "var(--gaine-text)" }}
            aria-label={t("gaineUi.expand", { title: t("gaineUi.moneyModelHeading") })}
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
        <ol
          className="mt-4 space-y-3 list-decimal list-outside pl-5 text-sm md:text-base leading-relaxed"
          style={{ color: "var(--gaine-muted)" }}
          aria-label={t("gaineUi.moneyModelAria")}
        >
          <li>{t("gaineUi.moneyModel1")}</li>
          <li>{t("gaineUi.moneyModel2")}</li>
          <li>{t("gaineUi.moneyModel3")}</li>
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}
