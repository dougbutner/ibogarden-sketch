"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { getGaineBalance } from "@/lib/api/gaine.functions";
import { verifyHolderSession } from "@/lib/api/auth.functions";
import { getWalletProvider, JUPITER_WALLET_INSTALL_URL } from "@/lib/solana-wallet";
import { truncateAddress } from "@/lib/solana";
import type { SolanaWalletProvider } from "@/types/solana-wallet";

type WalletContextValue = {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  gaineBalance: number | null;
  hasGaine: boolean;
  balanceLoading: boolean;
  panelOpen: boolean;
  error: string | null;
  walletName: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  setPanelOpen: (open: boolean) => void;
  openPanel: () => void;
  truncatedAddress: string | null;
};

const WalletContext = createContext<WalletContextValue | null>(null);

function activeProviderRef(): SolanaWalletProvider | null {
  return getWalletProvider()?.provider ?? null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [gaineBalance, setGaineBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const verifiedAddressRef = useRef<string | null>(null);

  const syncServerSession = useCallback(
    async (walletAddress: string, balance: number, providerName: string | null) => {
      if (balance <= 0) return;
      if (verifiedAddressRef.current === walletAddress) return;

      const waitlistEmail =
        typeof sessionStorage !== "undefined"
          ? sessionStorage.getItem("ibogarden-waitlist-email") ?? undefined
          : undefined;

      try {
        await verifyHolderSession({
          data: {
            address: walletAddress,
            email: waitlistEmail,
            walletProvider: providerName ?? undefined,
          },
        });
        verifiedAddressRef.current = walletAddress;
      } catch {
        /* DB unavailable should not block wallet UI */
      }
    },
    [],
  );

  const refreshBalance = useCallback(async () => {
    if (!address) {
      setGaineBalance(null);
      return;
    }

    setBalanceLoading(true);
    try {
      const balance = await getGaineBalance({ data: { address } });
      setGaineBalance(balance);
      setError(null);
      if (balance > 0) {
        await syncServerSession(address, balance, walletName);
      }
    } catch {
      setGaineBalance(null);
      setError("Could not load GAINE balance.");
    } finally {
      setBalanceLoading(false);
    }
  }, [address, walletName, syncServerSession]);

  const connect = useCallback(async () => {
    const wallet = getWalletProvider();
    if (!wallet) {
      setError("Install Jupiter Wallet or another Solana wallet.");
      window.open(JUPITER_WALLET_INSTALL_URL, "_blank", "noopener,noreferrer");
      return;
    }

    setConnecting(true);
    setError(null);
    try {
      const response = await wallet.provider.connect();
      setAddress(response.publicKey.toString());
      setWalletName(wallet.name);
      setPanelOpen(true);
    } catch {
      setError("Wallet connection was cancelled.");
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const provider = activeProviderRef();
    try {
      await provider?.disconnect();
    } catch {
      /* ignore */
    }
    setAddress(null);
    setGaineBalance(null);
    setWalletName(null);
    setError(null);
    verifiedAddressRef.current = null;
  }, []);

  useEffect(() => {
    const syncFromProvider = () => {
      const wallet = getWalletProvider();
      const provider = wallet?.provider;
      if (!provider) return;

      if (provider.publicKey) {
        setAddress(provider.publicKey.toString());
        setWalletName(wallet.name);
      }

      const onConnect = (...args: unknown[]) => {
        const key = args[0] as { publicKey?: { toString(): string } } | undefined;
        const next = key?.publicKey?.toString() ?? provider.publicKey?.toString() ?? null;
        setAddress(next);
        if (next) setWalletName(getWalletProvider()?.name ?? wallet.name);
      };

      const onDisconnect = () => {
        setAddress(null);
        setGaineBalance(null);
        setWalletName(null);
      };

      provider.on("connect", onConnect);
      provider.on("disconnect", onDisconnect);
      provider.on("accountChanged", onConnect);

      return () => {
        provider.removeListener("connect", onConnect);
        provider.removeListener("disconnect", onDisconnect);
        provider.removeListener("accountChanged", onConnect);
      };
    };

    return syncFromProvider();
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
      walletName,
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
      walletName,
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
