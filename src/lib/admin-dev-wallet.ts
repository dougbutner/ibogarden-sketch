import { ADMIN_DEV_WALLET } from "./app-constants";

export { ADMIN_DEV_WALLET };

export const ADMIN_DEV_WALLET_HINT = `${ADMIN_DEV_WALLET.slice(0, 8)}…`;

export function isAdminDevWalletAddress(address: string | null | undefined): boolean {
  return Boolean(address && address === ADMIN_DEV_WALLET);
}
