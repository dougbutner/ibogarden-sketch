import { type ReactNode } from "react";

import { useWallet } from "@/contexts/wallet-context";
import { ADMIN_DEV_WALLET_HINT, isAdminDevWalletAddress } from "@/lib/admin-dev-wallet";

import { AdminWalletProvider } from "./admin-wallet-context";

export function AdminGate({ children }: { children: ReactNode }) {
  const { address, connected, connect, connecting, truncatedAddress } = useWallet();
  const isDevWallet = isAdminDevWalletAddress(address);

  if (connected && isDevWallet && address) {
    return <AdminWalletProvider wallet={address}>{children}</AdminWalletProvider>;
  }

  return (
    <div className="relative min-h-[70vh]">
      <div className="blur-lg pointer-events-none select-none opacity-30 px-6 py-16 max-w-6xl mx-auto" aria-hidden="true">
        <div className="space-y-6">
          <div className="h-10 w-64 rounded-xl bg-forest/10" />
          <div className="h-32 rounded-3xl bg-forest/5" />
          <div className="h-80 rounded-3xl bg-forest/5" />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-forest/10 bg-earth/95 p-8 text-center shadow-2xl backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Admin</span>
          <h1 className="font-serif text-3xl italic text-forest mt-3 mb-4">Wallet required</h1>

          <p className="text-sm text-forest/65 leading-relaxed">
            Connect the dev Solana account starting with{" "}
            <strong className="font-mono text-forest">{ADMIN_DEV_WALLET_HINT}</strong> to access admin.
          </p>

          {connected && address && !isDevWallet ? (
            <p className="mt-4 text-sm text-red-700">
              Connected wallet ({truncatedAddress}) is not authorized.
            </p>
          ) : null}

          {!connected ? (
            <button
              type="button"
              onClick={() => void connect()}
              disabled={connecting}
              className="mt-6 bg-forest text-earth px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-moss transition-colors disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Connect wallet"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
