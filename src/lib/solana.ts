import { Connection, PublicKey } from "@solana/web3.js";

import { GAINE_CONTRACT_ADDRESS } from "@/data/gaine";

export const SOLANA_RPC =
  (import.meta.env.VITE_SOLANA_RPC as string | undefined) ?? "https://api.mainnet-beta.solana.com";

export const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
);

export const GAINE_MINT = new PublicKey(GAINE_CONTRACT_ADDRESS);

let connection: Connection | null = null;

export function getSolanaConnection() {
  if (!connection) {
    connection = new Connection(SOLANA_RPC, "confirmed");
  }
  return connection;
}

export async function fetchGaineBalance(ownerAddress: string): Promise<number> {
  const owner = new PublicKey(ownerAddress);
  const conn = getSolanaConnection();

  const [legacy, token2022] = await Promise.all([
    conn.getParsedTokenAccountsByOwner(owner, { mint: GAINE_MINT }),
    conn.getParsedTokenAccountsByOwner(owner, { mint: GAINE_MINT, programId: TOKEN_2022_PROGRAM_ID }),
  ]);

  return [...legacy.value, ...token2022.value].reduce((total, account) => {
    const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
    return total + (typeof amount === "number" ? amount : 0);
  }, 0);
}

export function truncateAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
