import process from "node:process";

import {
  ADMIN_DEV_WALLET,
  ADMIN_EMAIL,
  DATABASE_POOL_SIZE,
  GOOGLE_OAUTH_REDIRECT_PATH,
  SITE_ORIGIN,
} from "./app-constants";

export function resolveDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  return url || undefined;
}

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: resolveDatabaseUrl(),
    databasePoolSize: DATABASE_POOL_SIZE,
    adminEmail: ADMIN_EMAIL,
    adminDevWallet: ADMIN_DEV_WALLET,
    userSessionSecret: process.env.USER_SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: `${SITE_ORIGIN}${GOOGLE_OAUTH_REDIRECT_PATH}`,
    reflectionApiKey: process.env.REFLECTION_API_KEY,
  };
}
