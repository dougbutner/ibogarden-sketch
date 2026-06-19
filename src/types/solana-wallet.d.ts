export {};

export interface SolanaPublicKey {
  toString(): string;
  toBase58(): string;
}

export interface SolanaWalletProvider {
  isPhantom?: boolean;
  isJupiter?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  publicKey: SolanaPublicKey | null;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: SolanaPublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: "connect" | "disconnect" | "accountChanged", handler: (...args: unknown[]) => void) => void;
  removeListener: (
    event: "connect" | "disconnect" | "accountChanged",
    handler: (...args: unknown[]) => void,
  ) => void;
}

declare global {
  interface Window {
    solana?: SolanaWalletProvider;
    phantom?: { solana?: SolanaWalletProvider };
    solflare?: SolanaWalletProvider;
    backpack?: SolanaWalletProvider;
  }
}
