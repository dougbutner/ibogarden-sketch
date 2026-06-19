"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

import { useWallet } from "@/contexts/wallet-context";
import { GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WAITLIST_KEY = "ibogarden-community-waitlist";

function saveWaitlistEmail(email: string) {
  const existing = JSON.parse(localStorage.getItem(WAITLIST_KEY) ?? "[]") as string[];
  if (!existing.includes(email)) {
    localStorage.setItem(WAITLIST_KEY, JSON.stringify([...existing, email]));
  }
}

function CommunityWaitlist() {
  const { connect, openPanel } = useWallet();
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    saveWaitlistEmail(trimmed);
    setSaved(true);
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
        Leave your email for updates, then connect your Solana wallet to verify access.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
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
        <Button type="submit" variant="outline" className="w-full border-forest/15">
          {saved ? "Email saved — thank you" : "Save my email"}
        </Button>
      </form>

      <Button
        type="button"
        className="w-full bg-forest text-earth hover:bg-moss"
        onClick={() => void handleLogin()}
      >
        Login with wallet
      </Button>
    </div>
  );
}

function CommunityNoGaine() {
  const { truncatedAddress, gaineBalance, refreshBalance, balanceLoading } = useWallet();

  return (
    <div className="max-w-lg mx-auto bg-white border border-forest/10 rounded-3xl p-8 md:p-10 text-center">
      <img src={GAINE_TOKEN_IMAGE} alt="" className="size-10 rounded-full mx-auto mb-4" width={40} height={40} />
      <h2 className="font-serif text-3xl italic text-forest mb-3">Wallet connected</h2>
      <p className="font-mono text-sm text-forest/60 mb-4">{truncatedAddress}</p>
      <p className="text-forest/70 leading-relaxed mb-2">
        Your wallet holds{" "}
        <strong className="text-forest">{balanceLoading ? "…" : (gaineBalance ?? 0).toLocaleString()}</strong>{" "}
        <span className="gaine-word gaine-word-sm">GAINE</span>.
      </p>
      <p className="text-forest/65 text-sm mb-6">
        Hold any amount of GAINE to unlock the holder community.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild className="bg-gold text-forest hover:bg-gold/90">
          <Link to="/gaine">Get GAINE</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-forest/15"
          onClick={() => void refreshBalance()}
          disabled={balanceLoading}
        >
          Refresh balance
        </Button>
      </div>
    </div>
  );
}

function CommunityChatPlaceholder() {
  const { truncatedAddress, gaineBalance } = useWallet();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
            Holder chat
          </span>
          <h2 className="font-serif text-3xl italic text-forest mt-2">The inner garden</h2>
        </div>
        <div className="text-right text-xs text-forest/55">
          <p className="font-mono">{truncatedAddress}</p>
          <p>
            {(gaineBalance ?? 0).toLocaleString()} <span className="gaine-word gaine-word-sm">GAINE</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-forest/10 rounded-3xl overflow-hidden min-h-[420px] flex flex-col">
        <div className="flex-1 px-6 py-10 flex items-center justify-center text-center">
          <div className="max-w-sm">
            <img
              src={GAINE_TOKEN_IMAGE}
              alt=""
              className="size-12 rounded-full mx-auto mb-4 opacity-80"
              width={48}
              height={48}
            />
            <p className="font-serif text-xl italic text-forest mb-2">Chat coming soon</p>
            <p className="text-sm text-forest/60 leading-relaxed">
              You&apos;re verified as a GAINE holder. Real-time community chat will appear here.
            </p>
          </div>
        </div>
        <div className="border-t border-forest/10 px-4 py-4 bg-bone/30">
          <div className="flex gap-2 opacity-50 pointer-events-none">
            <Input disabled placeholder="Message the community…" className="border-forest/10 bg-white" />
            <Button disabled className="bg-forest text-earth shrink-0">
              Send
            </Button>
          </div>
        </div>
      </div>
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

  return <CommunityChatPlaceholder />;
}
