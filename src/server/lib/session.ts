import { createHash } from "node:crypto";

import type { SessionConfig } from "@tanstack/react-start/server";

import { getServerConfig } from "@/lib/config.server";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;
const DEV_SESSION_SECRET = "ibogarden-local-dev-session-secret-key";

export type UserSessionData = {
  userId: number;
  isHolder: boolean;
  email: string | null;
  displayName: string | null;
};

/** h3 sessions require a 32+ char sealing password; extend short env values deterministically. */
export function resolveSessionSecret(value: string | undefined, name: string): string {
  if (value && value.length >= 32) return value;

  if (value && value.length > 0) {
    return createHash("sha256").update(`ibogarden:${value}`).digest("hex");
  }

  const { databaseUrl } = getServerConfig();
  if (databaseUrl) {
    return createHash("sha256").update(`ibogarden-session:${databaseUrl}`).digest("hex");
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_SESSION_SECRET;
  }

  throw new Error(`${name} is not configured`);
}

export function getOAuthStateSessionConfig(): SessionConfig {
  const { userSessionSecret } = getServerConfig();
  return {
    name: "ibogarden-oauth",
    password: resolveSessionSecret(userSessionSecret, "USER_SESSION_SECRET"),
    maxAge: 600,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
  };
}

export function getUserSessionConfig(): SessionConfig {
  const { userSessionSecret } = getServerConfig();
  return {
    name: "ibogarden-user",
    password: resolveSessionSecret(userSessionSecret, "USER_SESSION_SECRET"),
    maxAge: SESSION_MAX_AGE,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
  };
}
