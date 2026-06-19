"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchGaineBalance, truncateAddress } from "@/lib/solana";

type WalletContextValue = {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  gaineBalance: number | null;
  hasGaine: boolean;
  balanceLoading: boolean;
  panelOpen: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  setPanelOpen: (open: boolean) => void;
  openPanel: () => void;
  truncatedAddress: string | null;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function getWalletProvider() {
  if (typeof window === "undefined") return null;
  return window.solana?.isPhantom ? window.solana : window.solana ?? null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [gaineBalance, setGaineBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!address) {
      setGaineBalance(null);
      return;
    }

    setBalanceLoading(true);
    try {
      const balance = await fetchGaineBalance(address);
      setGaineBalance(balance);
      setError(null);
    } catch {
      setGaineBalance(null);
      setError("Could not load GAINE balance.");
    } finally {
      setBalanceLoading(false);
    }
  }, [address]);

  const connect = useCallback(async () => {
    const provider = getWalletProvider();
    if (!provider) {
      setError("Install Phantom or another Solana wallet.");
      window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const response = await provider.connect();
      setAddress(response.publicKey.toString());
      setPanelOpen(true);
    } catch {
      setError("Wallet connection was cancelled.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const provider = getWalletProvider();
    try {
      await provider?.disconnect();
    } catch {
      /* ignore */
    }
    setAddress(null);
    setGaineBalance(null);
    setError(null);
  }, []);

  useEffect(() => {
    const provider = getWalletProvider();
    if (!provider) return;

    if (provider.publicKey) {
      setAddress(provider.publicKey.toString());
    }

    const onConnect = (...args: unknown[]) => {
      const key = args[0] as { publicKey?: { toString(): string } } | undefined;
      const next = key?.publicKey?.toString() ?? provider.publicKey?.toString() ?? null;
      setAddress(next);
    };

    const onDisconnect = () => {
      setAddress(null);
      setGaineBalance(null);
    };

    provider.on("connect", onConnect);
    provider.on("disconnect", onDisconnect);
    provider.on("accountChanged", onConnect);

    return () => {
      provider.removeListener("connect", onConnect);
      provider.removeListener("disconnect", onDisconnect);
      provider.removeListener("accountChanged", onConnect);
    };
  }, []);

  useEffect(() => {
    void refreshBalance();
  }, [refreshBalance]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connected: Boolean(address),
      connecting,
      gaineBalance,
      hasGaine: (gaineBalance ?? 0) > 0,
      balanceLoading,
      panelOpen,
      error,
      connect,
      disconnect,
      refreshBalance,
      setPanelOpen,
      openPanel: () => setPanelOpen(true),
      truncatedAddress: address ? truncateAddress(address) : null,
    }),
    [
      address,
      connecting,
      gaineBalance,
      balanceLoading,
      panelOpen,
      error,
      connect,
      disconnect,
      refreshBalance,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
