import { Connection, PublicKey } from "@solana/web3.js";

import { GAINE_CONTRACT_ADDRESS } from "@/data/gaine";

const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
const GAINE_MINT = new PublicKey(GAINE_CONTRACT_ADDRESS);

export async function fetchGaineBalance(ownerAddress: string): Promise<number> {
  const rpc =
    (process.env.SOLANA_RPC_URL as string | undefined) ??
    (process.env.VITE_SOLANA_RPC as string | undefined) ??
    (process.env.SOLANA_RPC as string | undefined) ??
    "https://api.mainnet-beta.solana.com";
  const conn = new Connection(rpc, "confirmed");
  const owner = new PublicKey(ownerAddress);

  const { value } = await conn.getParsedTokenAccountsByOwner(owner, {
    mint: GAINE_MINT,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  return value.reduce((total, account) => {
    const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
    return total + (typeof amount === "number" ? amount : 0);
  }, 0);
}
