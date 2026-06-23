"use client";

import { RefreshCw } from "lucide-react";

import { CommunityChat } from "@/components/community/community-chat";
import { useWallet } from "@/contexts/wallet-context";
import { GAINE_JUPITER_TOKEN_URL, GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { jupiterPortfolioUrl } from "@/lib/solana-wallet";
import { Button } from "@/components/ui/button";

function CommunityConnect() {
  const { connect, openPanel } = useWallet();

  return (
    <div className="max-w-lg mx-auto bg-white border border-forest/10 rounded-3xl p-8 md:p-10 text-center">
      <img src={GAINE_TOKEN_IMAGE} alt="" className="size-10 rounded-full mx-auto mb-4" width={40} height={40} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep">
        Holder access
      </span>
      <h2 className="font-serif text-3xl italic text-forest mt-3 mb-4">Connect your wallet</h2>
      <p className="text-forest/70 leading-relaxed mb-8">
        Community chat is open to any Solana wallet holding{" "}
        <span className="gaine-word gaine-word-sm">GAINE</span>. Connect to enter.
      </p>
      <Button
        type="button"
        className="w-full bg-forest text-earth hover:bg-moss"
        onClick={() => {
          openPanel();
          void connect();
        }}
      >
        Connect Solana wallet
      </Button>
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
    return <CommunityConnect />;
  }

  if (balanceLoading || connecting) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 text-forest/60">
        Checking <span className="gaine-word gaine-word-sm">GAINE</span> balance…
      </div>
    );
  }

  if (!hasGaine) {
    return <CommunityNoGaine />;
  }

  return <CommunityChat />;
}
