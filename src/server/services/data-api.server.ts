import process from "node:process";

function config() {
  return {
    url: process.env.ADMIN_DATA_API_URL?.trim(),
    secret: process.env.ADMIN_DATA_API_SECRET?.trim(),
  };
}

export function isRemoteDataApiEnabled(): boolean {
  const { url, secret } = config();
  return Boolean(url && secret);
}

export function remoteDb(): boolean {
  return (
    isRemoteDataApiEnabled() &&
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}

export async function callDataApi<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const { url, secret } = config();
  if (!url || !secret) {
    throw new Error("ADMIN_DATA_API_URL and ADMIN_DATA_API_SECRET are required");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-admin-secret": secret },
    body: JSON.stringify({ action, ...body }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { ok: true; data: T }
    | { ok: false; error?: string }
    | null;

  if (!payload?.ok) {
    throw new Error(payload?.error ?? `Data API error (${response.status})`);
  }

  return payload.data;
}
