"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { useLocale } from "@/contexts/locale-context";
import { GAINE_CONTRACT_ADDRESS, GAINE_PROJECT_WALLET } from "@/data/gaine";

function truncateAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function solscanTokenUrl(address: string) {
  return `https://solscan.io/token/${address}`;
}

function solscanAccountUrl(address: string) {
  return `https://solscan.io/account/${address}`;
}

type AddressBlockProps = {
  label: string;
  address: string;
  hint: string;
  solscanUrl: string;
};

function AddressBlock({ label, address, hint, solscanUrl, copiedLabel, copyLabel }: AddressBlockProps & { copiedLabel: string; copyLabel: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="text-left">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--gaine-muted)" }}>
        {label}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        className="gaine-surface-card w-full px-5 py-4 font-mono text-xs md:text-sm transition-all duration-300 hover:bg-white/[0.03] cursor-pointer overflow-hidden text-left"
        style={{ color: "var(--gaine-text)" }}
      >
        {copied ? copiedLabel : expanded ? address : truncateAddress(address)}
      </button>
      <p className="mt-2 text-xs" style={{ color: "var(--gaine-muted)" }}>
        {hint}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <a
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
          style={{ color: "var(--gaine-accent)" }}
        >
          Solscan
          <ExternalLink className="size-3" />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="transition-opacity hover:opacity-80"
          style={{ color: "var(--gaine-muted)" }}
        >
          {copyLabel}
        </button>
      </div>
    </div>
  );
}

export function GaineContractAddress() {
  const { t } = useLocale();
  const hasToken = GAINE_CONTRACT_ADDRESS.length > 0;
  const hasProject = GAINE_PROJECT_WALLET.length > 0;

  return (
    <section className="px-6 pb-20 max-w-2xl mx-auto w-full">
      <p
        className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] mb-6"
        style={{ color: "var(--gaine-accent)" }}
      >
        {t("gaineUi.contractTitle")}
      </p>

      {hasToken && hasProject ? (
        <div className="space-y-8">
          <AddressBlock
            label={t("gaineUi.tokenMint")}
            address={GAINE_CONTRACT_ADDRESS}
            hint={t("gaineUi.copyHint")}
            solscanUrl={solscanTokenUrl(GAINE_CONTRACT_ADDRESS)}
            copiedLabel={t("gaineUi.copied")}
            copyLabel={t("common.copy")}
          />
          <AddressBlock
            label={t("gaineUi.projectAccount")}
            address={GAINE_PROJECT_WALLET}
            hint={t("gaineUi.copyHint")}
            solscanUrl={solscanAccountUrl(GAINE_PROJECT_WALLET)}
            copiedLabel={t("gaineUi.copied")}
            copyLabel={t("common.copy")}
          />
        </div>
      ) : (
        <div
          className="gaine-surface-card w-full px-6 py-4 text-sm text-center"
          style={{ color: "var(--gaine-muted)" }}
        >
          {t("gaineUi.launchFallback")}
        </div>
      )}
    </section>
  );
}
