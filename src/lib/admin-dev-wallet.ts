export const ADMIN_DEV_WALLET =
  import.meta.env.VITE_ADMIN_DEV_WALLET ?? "GAinSTufAma6Z53W1EveJPYSXh2bJySw4k2kZ1TMoLF3";

export const ADMIN_DEV_WALLET_HINT = `${ADMIN_DEV_WALLET.slice(0, 8)}…`;

export function isAdminDevWalletAddress(address: string | null | undefined): boolean {
  return Boolean(address && address === ADMIN_DEV_WALLET);
}
