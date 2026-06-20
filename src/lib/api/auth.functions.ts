import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import { getUserById, verifyHolderLogin } from "@/server/services/holder.service";
import { getUserSessionConfig, type UserSessionData } from "@/server/lib/session";

export const verifyHolderSession = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      address: z.string().min(32).max(44),
      email: z.string().email().optional(),
      walletProvider: z.string().max(32).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userSession = await useSession<UserSessionData>(getUserSessionConfig());
    const result = await verifyHolderLogin({
      address: data.address,
      email: data.email,
      walletProvider: data.walletProvider,
      userAccountId: userSession.data?.userId,
    });

    await userSession.update({
      userId: result.userId,
      isHolder: result.isHolder,
      email: result.email,
      displayName: result.displayName,
    });

    return result;
  });

export const getUserSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<UserSessionData>(getUserSessionConfig());
  if (!session.data?.userId) return { authenticated: false as const };

  const user = await getUserById(session.data.userId);
  if (!user) {
    await session.clear();
    return { authenticated: false as const };
  }

  return {
    authenticated: true as const,
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    holderStatus: user.holderStatus,
    isHolder: session.data.isHolder,
  };
});

export const userLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<UserSessionData>(getUserSessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const isGoogleOAuthEnabled = createServerFn({ method: "GET" }).handler(async () => {
  const { isGoogleOAuthConfigured } = await import("@/server/services/oauth-google.service");
  return { enabled: isGoogleOAuthConfigured() };
});
