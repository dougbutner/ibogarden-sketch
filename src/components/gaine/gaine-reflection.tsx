"use client";

import { useEffect, useMemo, useState } from "react";

import {
  GAINE_JUPITER_TOKEN_URL,
  GAINE_REFLECTION_DIRECTIONS,
  GAINE_REFLECTION_MIN_BALANCE,
} from "@/data/gaine";
import { useWallet } from "@/contexts/wallet-context";
import {
  getReflectionOptions,
  getReflectionPreference,
  saveReflectionPreference,
} from "@/lib/api/reflection.functions";
import { getUserSession } from "@/lib/api/auth.functions";
import type { ReflectionCategorySlug } from "@/data/reflection-destinations";
import { IMPACT_PROJECT_FALLBACK } from "@/data/reflection-destinations";

type ImpactProjectOption = {
  slug: string;
  name: string;
  description: string;
};

export function GaineReflection() {
  const { address, connected, connect, openPanel, gaineBalance, balanceLoading } = useWallet();
  const [directionSlug, setDirectionSlug] = useState<ReflectionCategorySlug>(
    GAINE_REFLECTION_DIRECTIONS[0].slug,
  );
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [projects, setProjects] = useState<ImpactProjectOption[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [savedDirectionSlug, setSavedDirectionSlug] = useState<ReflectionCategorySlug | null>(null);
  const [savedProjectSlug, setSavedProjectSlug] = useState<string | null>(null);
  const [loadingPreference, setLoadingPreference] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eligibleBalance = (gaineBalance ?? 0) >= GAINE_REFLECTION_MIN_BALANCE;
  const showProjects = directionSlug === "specific_project";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingPreference(true);
      setError(null);

      try {
        const options = await getReflectionOptions();
        if (!cancelled) {
          setProjects(options.projects.length > 0 ? options.projects : IMPACT_PROJECT_FALLBACK);
        }
      } catch {
        if (!cancelled) {
          setProjects(IMPACT_PROJECT_FALLBACK);
        }
      }

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
          setProjectSlug(preference.projectSlug);
          setSavedDirectionSlug(preference.directionSlug);
          setSavedProjectSlug(preference.projectSlug);
        }
      } catch {
        /* preference unavailable before migration or without session */
      }

      if (!cancelled) {
        setProjectSlug((current) => current ?? IMPACT_PROJECT_FALLBACK[0]?.slug ?? null);
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
    if (directionSlug === "specific_project") {
      return savedProjectSlug === projectSlug;
    }
    return true;
  }, [savedDirectionSlug, savedProjectSlug, directionSlug, projectSlug]);

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

    if (directionSlug === "specific_project" && !projectSlug) {
      setError("Choose a project to direct rewards.");
      return;
    }

    setSaving(true);
    try {
      const saved = await saveReflectionPreference({
        data: {
          walletAddress: address,
          directionSlug,
          projectSlug: directionSlug === "specific_project" ? (projectSlug ?? undefined) : undefined,
        },
      });

      setSavedDirectionSlug(saved.directionSlug);
      setSavedProjectSlug(saved.projectSlug);
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

      {showProjects ? (
        <div className="mt-8">
          <h3 className="gaine-display text-xl mb-4">Choose a project</h3>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {projects.map((project) => {
              const selected = projectSlug === project.slug;
              return (
                <button
                  key={project.slug}
                  type="button"
                  onClick={() => setProjectSlug(project.slug)}
                  className="gaine-surface-card text-left p-5 transition-all cursor-pointer"
                  style={
                    selected
                      ? {
                          borderColor: "var(--gaine-accent)",
                          boxShadow:
                            "0 0 0 1px var(--gaine-accent), 0 0 20px color-mix(in srgb, var(--gaine-accent) 20%, transparent)",
                        }
                      : undefined
                  }
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <span className="font-semibold text-base">{project.name}</span>
                    <div
                      className="size-4 rounded-full border-2 shrink-0 mt-1"
                      style={
                        selected
                          ? { borderColor: "var(--gaine-accent)", background: "var(--gaine-accent)" }
                          : { borderColor: "var(--gaine-border)" }
                      }
                    />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--gaine-muted)" }}>
                    {project.description}
                  </p>
                </button>
              );
            })}
          </div>
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
