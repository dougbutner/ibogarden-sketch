import process from "node:process";

function buildDatabaseUrl(input: {
  url?: string;
  host?: string;
  user?: string;
  password?: string;
  name?: string;
  port?: string;
}): string | undefined {
  if (input.url) return input.url;

  const host = input.host;
  const user = input.user;
  const password = input.password;
  const name = input.name;
  const port = input.port ?? "3306";

  if (host && user && password && name) {
    return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
  }

  return undefined;
}

function resolveLocalDatabaseUrl(): string | undefined {
  return buildDatabaseUrl({
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
}

function resolveLiveDatabaseUrl(): string | undefined {
  return buildDatabaseUrl({
    url: process.env.LIVE_DATABASE_URL,
    host: process.env.LIVE_DB_HOST,
    user: process.env.LIVE_DB_USER,
    password: process.env.LIVE_DB_PASSWORD,
    name: process.env.LIVE_DB_NAME,
    port: process.env.LIVE_DB_PORT,
  });
}

/** Local dev uses DB_*; ibo.garden production uses LIVE_DB_*. Override with DATABASE_TARGET=local|live. */
export function shouldUseLiveDatabase(): boolean {
  const target = process.env.DATABASE_TARGET?.trim().toLowerCase();
  if (target === "live") return true;
  if (target === "local") return false;

  if (process.env.NODE_ENV !== "production") return false;

  const siteUrl = (process.env.VITE_SITE_URL ?? process.env.SITE_URL ?? "").toLowerCase();
  return siteUrl.includes("ibo.garden");
}

export function resolveDatabaseUrl(): string | undefined {
  if (shouldUseLiveDatabase()) {
    return resolveLiveDatabaseUrl() ?? resolveLocalDatabaseUrl();
  }

  return resolveLocalDatabaseUrl();
}

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: resolveDatabaseUrl(),
    databaseTarget: shouldUseLiveDatabase() ? ("live" as const) : ("local" as const),
    databasePoolSize: Number(process.env.DATABASE_POOL_SIZE ?? 5),
    adminEmail: process.env.ADMIN_EMAIL ?? "dougbutner@gmail.com",
    adminDevWallet: process.env.ADMIN_DEV_WALLET ?? "GAinSTufAma6Z53W1EveJPYSXh2bJySw4k2kZ1TMoLF3",
    userSessionSecret: process.env.USER_SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    reflectionApiKey: process.env.REFLECTION_API_KEY,
  };
}
