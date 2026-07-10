"use client";

import { useEffect, useMemo, useState } from "react";

import {
  GAINE_JUPITER_TOKEN_URL,
  GAINE_REFLECTION_DIRECTIONS,
  GAINE_REFLECTION_MIN_BALANCE,
} from "@/data/gaine";
import { useWallet } from "@/contexts/wallet-context";
import {
  getReflectionPreference,
  saveReflectionPreference,
} from "@/lib/api/reflection.functions";
import { getUserSession } from "@/lib/api/auth.functions";
import type { ReflectionCategorySlug } from "@/data/reflection-destinations";
import { UNREGISTERED_PROJECT_SLUG } from "@/data/reflection-destinations";

export function GaineReflection() {
  const { address, connected, connect, openPanel, gaineBalance, balanceLoading } = useWallet();
  const [directionSlug, setDirectionSlug] = useState<ReflectionCategorySlug>(
    GAINE_REFLECTION_DIRECTIONS[0].slug,
  );
  const [customTitle, setCustomTitle] = useState("");
  const [customWallet, setCustomWallet] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [savedDirectionSlug, setSavedDirectionSlug] = useState<ReflectionCategorySlug | null>(null);
  const [savedCustomTitle, setSavedCustomTitle] = useState<string | null>(null);
  const [savedCustomWallet, setSavedCustomWallet] = useState<string | null>(null);
  const [loadingPreference, setLoadingPreference] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eligibleBalance = (gaineBalance ?? 0) >= GAINE_REFLECTION_MIN_BALANCE;
  const showUnregistered = directionSlug === UNREGISTERED_PROJECT_SLUG;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingPreference(true);
      setError(null);

      try {
        const session = await getUserSession();
        if (!cancelled) {
          setAuthenticated(session.authenticated);
        }
      } catch {
        if (!cancelled) {
          setAuthenticated(false);
        }
      }

      try {
        const preference = await getReflectionPreference();
        if (!cancelled && preference.authenticated && preference.directionSlug) {
          setDirectionSlug(preference.directionSlug);
          setCustomTitle(preference.customTitle ?? "");
          setCustomWallet(preference.customWallet ?? "");
          setSavedDirectionSlug(preference.directionSlug);
          setSavedCustomTitle(preference.customTitle);
          setSavedCustomWallet(preference.customWallet);
        }
      } catch {
        /* preference unavailable without session */
      }

      if (!cancelled) {
        setLoadingPreference(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [connected, address]);

  const selectionUnchanged = useMemo(() => {
    if (!savedDirectionSlug) return false;
    if (savedDirectionSlug !== directionSlug) return false;
    if (directionSlug === UNREGISTERED_PROJECT_SLUG) {
      return savedCustomTitle === customTitle.trim() && savedCustomWallet === customWallet.trim();
    }
    return true;
  }, [savedDirectionSlug, savedCustomTitle, savedCustomWallet, directionSlug, customTitle, customWallet]);

  async function handlePrimaryAction() {
    setError(null);
    setStatus(null);

    if (!connected || !address) {
      openPanel();
      await connect();
      return;
    }

    if (!eligibleBalance) {
      window.open(GAINE_JUPITER_TOKEN_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (!authenticated) {
      setError("Verifying wallet session… try again in a moment.");
      return;
    }

    if (directionSlug === UNREGISTERED_PROJECT_SLUG) {
      const title = customTitle.trim();
      const wallet = customWallet.trim();
      if (!title || title.length > 50) {
        setError("Enter a project title (1–50 characters).");
        return;
      }
      if (wallet.length < 32 || wallet.length > 44) {
        setError("Enter a valid Solana wallet address.");
        return;
      }
    }

    setSaving(true);
    try {
      const saved = await saveReflectionPreference({
        data: {
          walletAddress: address,
          directionSlug,
          customTitle:
            directionSlug === UNREGISTERED_PROJECT_SLUG ? customTitle.trim() : undefined,
          customWallet:
            directionSlug === UNREGISTERED_PROJECT_SLUG ? customWallet.trim() : undefined,
        },
      });

      setSavedDirectionSlug(saved.directionSlug as ReflectionCategorySlug | null);
      setSavedCustomTitle(saved.customTitle);
      setSavedCustomWallet(saved.customWallet);
      setCustomTitle(saved.customTitle ?? "");
      setCustomWallet(saved.customWallet ?? "");
      setStatus("Your reward direction is saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your direction.");
    } finally {
      setSaving(false);
    }
  }

  const primaryLabel = !connected
    ? "Login with wallet"
    : !eligibleBalance
      ? "You need 100 GAINE"
      : saving
        ? "Saving…"
        : selectionUnchanged
          ? "Direction saved"
          : "Save direction";

  const primaryDisabled =
    connected &&
    eligibleBalance &&
    (saving || balanceLoading || loadingPreference || (selectionUnchanged && Boolean(savedDirectionSlug)));

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="gaine-display text-3xl md:text-4xl">Where does your 2% flow?</h2>
        <p className="mt-3 text-sm md:text-base max-w-lg mx-auto" style={{ color: "var(--gaine-muted)" }}>
          Hold {GAINE_REFLECTION_MIN_BALANCE.toLocaleString()} GAINE or more, connect your wallet, and choose where
          transfer fees convert to USDC and route on-chain.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {GAINE_REFLECTION_DIRECTIONS.map((direction) => {
          const selected = directionSlug === direction.slug;
          return (
            <button
              key={direction.slug}
              type="button"
              onClick={() => setDirectionSlug(direction.slug)}
              className="gaine-surface-card text-left p-5 md:p-6 transition-all cursor-pointer"
              style={
                selected
                  ? {
                      borderColor: "var(--gaine-primary)",
                      boxShadow:
                        "0 0 0 1px var(--gaine-primary), 0 0 24px color-mix(in srgb, var(--gaine-primary) 25%, transparent)",
                    }
                  : undefined
              }
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <span className="gaine-display text-lg">{direction.key}</span>
                <div
                  className="size-4 rounded-full border-2 shrink-0 mt-1"
                  style={
                    selected
                      ? { borderColor: "var(--gaine-primary)", background: "var(--gaine-primary)" }
                      : { borderColor: "var(--gaine-border)" }
                  }
                />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
                {direction.desc}
              </p>
            </button>
          );
        })}
      </div>

      {showUnregistered ? (
        <div className="mt-8 gaine-surface-card p-5 md:p-6 max-w-xl mx-auto space-y-4">
          <h3 className="gaine-display text-xl">Unregistered project details</h3>
          <p className="text-sm" style={{ color: "var(--gaine-muted)" }}>
            Available when you hold {GAINE_REFLECTION_MIN_BALANCE}+ GAINE. USDC routes to the Solana address you
            enter.
          </p>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--gaine-muted)" }}>
              Project title
            </span>
            <input
              type="text"
              value={customTitle}
              maxLength={50}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Short name (max 50 characters)"
              className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: "var(--gaine-border)", color: "inherit" }}
            />
            <span className="text-xs" style={{ color: "var(--gaine-muted)" }}>
              {customTitle.trim().length}/50
            </span>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--gaine-muted)" }}>
              Solana recipient address
            </span>
            <input
              type="text"
              value={customWallet}
              maxLength={44}
              onChange={(e) => setCustomWallet(e.target.value)}
              placeholder="Solana wallet address"
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono bg-transparent"
              style={{ borderColor: "var(--gaine-border)", color: "inherit" }}
              spellCheck={false}
              autoComplete="off"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => void handlePrimaryAction()}
          disabled={primaryDisabled}
          className="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest transition-opacity disabled:opacity-60"
          style={{ background: "var(--gaine-primary)", color: "var(--gaine-bg)" }}
        >
          {primaryLabel}
        </button>

        {status ? (
          <p className="text-sm" style={{ color: "var(--gaine-primary)" }}>
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--gaine-muted)" }}>
        No selection defaults to a balanced project split.
      </p>
    </section>
  );
}
