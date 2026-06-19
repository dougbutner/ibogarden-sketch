import type { SolanaWalletProvider } from "@/types/solana-wallet";

export type WalletProviderInfo = {
  provider: SolanaWalletProvider;
  name: string;
};

function providerName(provider: SolanaWalletProvider): string {
  if (provider.isJupiter) return "Jupiter";
  if (provider.isPhantom) return "Phantom";
  if (provider.isSolflare) return "Solflare";
  if (provider.isBackpack) return "Backpack";
  return "Solana";
}

function addCandidate(
  candidates: WalletProviderInfo[],
  seen: Set<SolanaWalletProvider>,
  provider: SolanaWalletProvider | undefined,
) {
  if (!provider || seen.has(provider)) return;
  seen.add(provider);
  candidates.push({ provider, name: providerName(provider) });
}

export function getWalletCandidates(): WalletProviderInfo[] {
  if (typeof window === "undefined") return [];

  const candidates: WalletProviderInfo[] = [];
  const seen = new Set<SolanaWalletProvider>();

  addCandidate(candidates, seen, window.solana);
  addCandidate(candidates, seen, window.phantom?.solana);
  addCandidate(candidates, seen, window.solflare);
  addCandidate(candidates, seen, window.backpack);

  return candidates;
}

export function getWalletProvider(): WalletProviderInfo | null {
  const candidates = getWalletCandidates();
  if (!candidates.length) return null;

  const connected = candidates.find(({ provider }) => provider.publicKey);
  if (connected) return connected;

  const jupiter = candidates.find(({ name }) => name === "Jupiter");
  return jupiter ?? candidates[0] ?? null;
}

export const JUPITER_WALLET_INSTALL_URL =
  "https://chromewebstore.google.com/detail/jupiter-wallet/iledlaeogohbilgbfhmbgkgmpplbfboh";

export function jupiterPortfolioUrl(address: string) {
  return `https://jup.ag/portfolio/${address}`;
}
