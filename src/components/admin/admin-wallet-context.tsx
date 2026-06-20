import { createContext, useContext, type ReactNode } from "react";

const AdminWalletContext = createContext<string | null>(null);

export function AdminWalletProvider({ wallet, children }: { wallet: string; children: ReactNode }) {
  return <AdminWalletContext.Provider value={wallet}>{children}</AdminWalletContext.Provider>;
}

export function useAdminWallet(): string {
  const wallet = useContext(AdminWalletContext);
  if (!wallet) throw new Error("Admin wallet not available");
  return wallet;
}
