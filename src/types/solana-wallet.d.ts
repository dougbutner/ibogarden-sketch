export {};

interface SolanaPublicKey {
  toString(): string;
  toBase58(): string;
}

interface SolanaWalletProvider {
  isPhantom?: boolean;
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
  }
}
