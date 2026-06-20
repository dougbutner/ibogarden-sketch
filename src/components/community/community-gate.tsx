"use client";

import { useState, useEffect, type FormEvent } from "react";
import { RefreshCw } from "lucide-react";

import { CommunityChat } from "@/components/community/community-chat";
import { useWallet } from "@/contexts/wallet-context";
import { joinCommunityWaitlist } from "@/lib/api/waitlist.functions";
import { isGoogleOAuthEnabled } from "@/lib/api/auth.functions";
import { GAINE_JUPITER_TOKEN_URL, GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { jupiterPortfolioUrl } from "@/lib/solana-wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WAITLIST_EMAIL_KEY = "ibogarden-waitlist-email";

function CommunityWaitlist() {
  const { connect, openPanel } = useWallet();
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void isGoogleOAuthEnabled().then((r) => setGoogleEnabled(r.enabled));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await joinCommunityWaitlist({ data: { email: trimmed, source: "community_page" } });
      sessionStorage.setItem(WAITLIST_EMAIL_KEY, trimmed);
      setSaved(true);
    } catch {
      setError("Could not save email. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin() {
    openPanel();
    await connect();
  }

  return (
    <div className="max-w-lg mx-auto bg-white border border-forest/10 rounded-3xl p-8 md:p-10">
      <div className="flex items-center gap-3 mb-5">
        <img src={GAINE_TOKEN_IMAGE} alt="" className="size-8 rounded-full" width={32} height={32} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
          Holder access
        </span>
      </div>
      <h2 className="font-serif text-3xl italic text-forest mb-4">Connect to enter</h2>
      <p className="text-forest/70 leading-relaxed mb-6">
        Community chat is token-gated for <span className="gaine-word gaine-word-sm">GAINE</span> holders.
        Leave your email for updates, then sign in with Google or connect your Solana wallet.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 mb-6">
        <div>
          <label htmlFor="community-email" className="sr-only">
            Email
          </label>
          <Input
            id="community-email"
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border-forest/15 bg-bone/30"
          />
        </div>
        <Button type="submit" variant="outline" className="w-full border-forest/15" disabled={submitting}>
          {saved ? "Email saved — thank you" : submitting ? "Saving…" : "Save my email"}
        </Button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>

      <div className="space-y-3">
        {googleEnabled ? (
          <a
            href="/api/auth/google"
            className="flex w-full items-center justify-center gap-2 border border-forest/15 rounded-full py-3 text-xs font-bold uppercase tracking-widest text-forest hover:bg-bone/50 transition-colors"
          >
            Continue with Google
          </a>
        ) : null}
        <Button
          type="button"
          className="w-full bg-forest text-earth hover:bg-moss"
          onClick={() => void handleLogin()}
        >
          Login with wallet
        </Button>
      </div>
    </div>
  );
}

function CommunityNoGaine() {
  const { address, truncatedAddress, gaineBalance, refreshBalance, balanceLoading } = useWallet();

  return (
    <div className="max-w-lg mx-auto bg-white border border-forest/10 rounded-3xl p-8 md:p-10 text-center relative">
      <button
        type="button"
        aria-label="Refresh balance"
        onClick={() => void refreshBalance()}
        disabled={balanceLoading}
        className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-full text-forest/45 transition-colors hover:bg-forest/5 hover:text-forest disabled:opacity-40"
      >
        <RefreshCw className={`size-3.5 ${balanceLoading ? "animate-spin" : ""}`} />
      </button>
      <img src={GAINE_TOKEN_IMAGE} alt="" className="size-10 rounded-full mx-auto mb-4" width={40} height={40} />
      <h2 className="font-serif text-3xl italic text-forest mb-3">Wallet connected</h2>
      {address ? (
        <a
          href={jupiterPortfolioUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-forest/60 hover:text-gold underline-offset-2 hover:underline inline-block mb-4"
        >
          {truncatedAddress}
        </a>
      ) : (
        <p className="font-mono text-sm text-forest/60 mb-4">{truncatedAddress}</p>
      )}
      <p className="text-forest/70 leading-relaxed mb-2">
        Your wallet holds{" "}
        <strong className="text-forest">{balanceLoading ? "…" : (gaineBalance ?? 0).toLocaleString()}</strong>{" "}
        <span className="gaine-word gaine-word-sm">GAINE</span>.
      </p>
      <p className="text-forest/65 text-sm mb-6">
        Hold any amount of GAINE to unlock the holder community.
      </p>
      <Button
        asChild
        className="btn-gaine w-full sm:w-auto rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90"
        style={{ background: "var(--gaine-primary)", color: "var(--gaine-bg)" }}
      >
        <a href={GAINE_JUPITER_TOKEN_URL} target="_blank" rel="noopener noreferrer">
          Buy GAINE
        </a>
      </Button>
    </div>
  );
}

export function CommunityGate() {
  const { connected, hasGaine, balanceLoading, connecting } = useWallet();

  if (!connected) {
    return <CommunityWaitlist />;
  }

  if (balanceLoading || connecting) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 text-forest/60">
        Verifying <span className="gaine-word gaine-word-sm">GAINE</span> balance…
      </div>
    );
  }

  if (!hasGaine) {
    return <CommunityNoGaine />;
  }

  return <CommunityChat />;
}

export { WAITLIST_EMAIL_KEY };
