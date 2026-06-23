/** Verified fallbacks for getTokenAccountsByOwner / getTokenAccountBalance (tested Jun 2026). */
export const SOLANA_RPC_FALLBACKS = [
  "https://api.mainnet-beta.solana.com",
  "https://api.mainnet.solana.com",
  "https://rpc.solanatracker.io/public",
] as const;

export function getSolanaRpcUrls(): string[] {
  const configured = [
    process.env.SOLANA_RPC_URL,
    process.env.SOLANA_RPC,
    process.env.VITE_SOLANA_RPC,
  ].filter((value): value is string => Boolean(value?.trim()));

  return [...new Set([...configured, ...SOLANA_RPC_FALLBACKS])];
}

type RpcError = { code?: number; message?: string };

export async function solanaRpcRequest<T>(
  rpcUrl: string,
  method: string,
  params: unknown[],
): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });

  if (!res.ok) {
    throw new Error(`RPC HTTP ${res.status}`);
  }

  const body = (await res.json()) as { result?: T; error?: RpcError };
  if (body.error) {
    throw new Error(body.error.message ?? `RPC error ${body.error.code ?? ""}`.trim());
  }

  return body.result as T;
}
