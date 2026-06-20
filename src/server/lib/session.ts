import type { SessionConfig } from "@tanstack/react-start/server";

import { getServerConfig } from "@/lib/config.server";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export type UserSessionData = {
  userId: number;
  isHolder: boolean;
  email: string | null;
  displayName: string | null;
};

function requireSecret(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function getOAuthStateSessionConfig(): SessionConfig {
  const { userSessionSecret } = getServerConfig();
  return {
    name: "ibogarden-oauth",
    password: requireSecret(userSessionSecret, "USER_SESSION_SECRET"),
    maxAge: 600,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
  };
}

export function getUserSessionConfig(): SessionConfig {
  const { userSessionSecret } = getServerConfig();
  return {
    name: "ibogarden-user",
    password: requireSecret(userSessionSecret, "USER_SESSION_SECRET"),
    maxAge: SESSION_MAX_AGE,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
  };
}
