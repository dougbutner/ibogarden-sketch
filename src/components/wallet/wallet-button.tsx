"use client";

import { Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

import { useWallet } from "@/contexts/wallet-context";
import { GAINE_TOKEN_IMAGE } from "@/data/gaine";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function WalletButton() {
  const {
    connected,
    connecting,
    truncatedAddress,
    gaineBalance,
    hasGaine,
    balanceLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
    panelOpen,
    setPanelOpen,
  } = useWallet();

  return (
    <Popover open={panelOpen} onOpenChange={setPanelOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={connected ? `Wallet ${truncatedAddress}` : "Connect wallet"}
          onMouseEnter={() => setPanelOpen(true)}
          className={`relative flex size-9 items-center justify-center rounded-full border transition-colors ${
            connected
              ? "border-gold/50 bg-gold/10 text-gold hover:bg-gold/20"
              : "border-forest/15 bg-white/60 text-forest/70 hover:border-gold/40 hover:text-gold"
          }`}
        >
          <Wallet className="size-4" />
          {connected && hasGaine ? (
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-gold ring-2 ring-earth" />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 border-forest/15 bg-earth p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src={GAINE_TOKEN_IMAGE} alt="" className="size-6 rounded-full" width={24} height={24} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-forest/60">Solana wallet</p>
              {connected && truncatedAddress ? (
                <p className="font-mono text-sm text-forest">{truncatedAddress}</p>
              ) : (
                <p className="text-sm text-forest/70">Not connected</p>
              )}
            </div>
          </div>

          {connected ? (
            <div className="rounded-xl border border-forest/10 bg-white/70 px-3 py-2.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-forest/60">
                  <span className="gaine-word gaine-word-sm">GAINE</span> balance
                </span>
                <span className="font-mono font-medium text-forest">
                  {balanceLoading ? "…" : (gaineBalance ?? 0).toLocaleString()}
                </span>
              </div>
              {hasGaine ? (
                <p className="mt-1 text-xs text-gold-deep">Holder access unlocked</p>
              ) : (
                <p className="mt-1 text-xs text-forest/55">Hold GAINE to enter Community chat</p>
              )}
            </div>
          ) : null}

          {error ? <p className="text-xs text-red-700/80">{error}</p> : null}

          <div className="flex flex-col gap-2">
            {connected ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-forest/15"
                  onClick={() => void refreshBalance()}
                  disabled={balanceLoading}
                >
                  Refresh balance
                </Button>
                {hasGaine ? (
                  <Button asChild size="sm" className="w-full bg-forest text-earth hover:bg-moss">
                    <Link to="/community" onClick={() => setPanelOpen(false)}>
                      Open Community
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="sm" className="w-full bg-gold text-forest hover:bg-gold/90">
                    <Link to="/gaine" onClick={() => setPanelOpen(false)}>
                      Get GAINE
                    </Link>
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-forest/60"
                  onClick={() => void disconnect()}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                type="button"
                size="sm"
                className="w-full bg-forest text-earth hover:bg-moss"
                onClick={() => void connect()}
                disabled={connecting}
              >
                {connecting ? "Connecting…" : "Connect wallet"}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
