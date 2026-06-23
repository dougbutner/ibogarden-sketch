import { GAINE_CONTRACT_ADDRESS } from "@/data/gaine";
import { getSolanaRpcUrls, solanaRpcRequest } from "@/lib/solana-rpc";

const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const ASSOCIATED_TOKEN_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

type ParsedTokenAccount = {
  account: {
    data: {
      parsed: {
        info: {
          tokenAmount: {
            uiAmount: number | null;
          };
        };
      };
    };
  };
};

type TokenAccountsByOwnerResult = {
  value: ParsedTokenAccount[];
};

type TokenAccountBalanceResult = {
  value: {
    uiAmount: number | null;
  };
};

async function deriveToken2022Ata(owner: string, mint: string): Promise<string> {
  const { address, getAddressEncoder, getProgramDerivedAddress } = await import("@solana/kit");
  const enc = getAddressEncoder();
  const [ata] = await getProgramDerivedAddress({
    programAddress: address(ASSOCIATED_TOKEN_PROGRAM_ID),
    seeds: [
      enc.encode(address(owner)),
      enc.encode(address(TOKEN_2022_PROGRAM_ID)),
      enc.encode(address(mint)),
    ],
  });
  return ata;
}

function sumParsedBalances(accounts: ParsedTokenAccount[]): number {
  return accounts.reduce((total, account) => {
    const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
    return total + (typeof amount === "number" ? amount : 0);
  }, 0);
}

async function fetchBalanceViaTokenAccounts(
  rpcUrl: string,
  owner: string,
  mint: string,
): Promise<number> {
  const result = await solanaRpcRequest<TokenAccountsByOwnerResult>(
    rpcUrl,
    "getTokenAccountsByOwner",
    [owner, { mint }, { encoding: "jsonParsed", commitment: "confirmed" }],
  );
  return sumParsedBalances(result.value);
}

async function fetchBalanceViaAta(rpcUrl: string, owner: string, mint: string): Promise<number> {
  const ata = await deriveToken2022Ata(owner, mint);
  try {
    const result = await solanaRpcRequest<TokenAccountBalanceResult>(
      rpcUrl,
      "getTokenAccountBalance",
      [ata, { commitment: "confirmed" }],
    );
    return result.value.uiAmount ?? 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/could not find account|Invalid param/i.test(message)) {
      return 0;
    }
    throw error;
  }
}

export async function fetchGaineBalance(ownerAddress: string): Promise<number> {
  const mint = GAINE_CONTRACT_ADDRESS;
  let lastError: unknown;

  for (const rpcUrl of getSolanaRpcUrls()) {
    try {
      return await fetchBalanceViaTokenAccounts(rpcUrl, ownerAddress, mint);
    } catch (error) {
      lastError = error;
    }
  }

  for (const rpcUrl of getSolanaRpcUrls()) {
    try {
      return await fetchBalanceViaAta(rpcUrl, ownerAddress, mint);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to load GAINE balance from Solana RPC");
}
