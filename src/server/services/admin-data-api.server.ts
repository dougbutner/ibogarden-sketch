import process from "node:process";

function getRemoteAdminDataApiConfig() {
  return {
    url: process.env.ADMIN_DATA_API_URL?.trim(),
    secret: process.env.ADMIN_DATA_API_SECRET?.trim(),
  };
}

export function isRemoteAdminDataApiEnabled(): boolean {
  const { url, secret } = getRemoteAdminDataApiConfig();
  return Boolean(url && secret);
}

export async function callRemoteAdminDataApi<T>(
  action: string,
  body: Record<string, unknown> = {},
): Promise<T> {
  const { url, secret } = getRemoteAdminDataApiConfig();
  if (!url || !secret) {
    throw new Error("ADMIN_DATA_API_URL and ADMIN_DATA_API_SECRET are required");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-secret": secret,
    },
    body: JSON.stringify({ action, ...body }),
  });

  const payload = (await response.json().catch(() => null)) as
    | { ok: true; data: T }
    | { ok: false; error?: string }
    | null;

  if (!payload?.ok) {
    throw new Error(payload?.error ?? `Admin data API error (${response.status})`);
  }

  return payload.data;
}
