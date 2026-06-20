import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import { REFLECTION_CATEGORY_SLUGS } from "@/data/reflection-destinations";
import { getUserSessionConfig, type UserSessionData } from "@/server/lib/session";
import {
  getReflectionDestinations,
  getUserReflectionPreference,
  saveUserReflectionPreference,
} from "@/server/services/reflection.service";

export const getReflectionOptions = createServerFn({ method: "GET" }).handler(async () => {
  return getReflectionDestinations();
});

export const getReflectionPreference = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<UserSessionData>(getUserSessionConfig());
  if (!session.data?.userId) {
    return { authenticated: false as const };
  }

  const preference = await getUserReflectionPreference(session.data.userId);
  return { authenticated: true as const, ...preference };
});

export const saveReflectionPreference = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      walletAddress: z.string().min(32).max(44),
      directionSlug: z.enum(REFLECTION_CATEGORY_SLUGS),
      projectSlug: z.string().min(1).max(96).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await useSession<UserSessionData>(getUserSessionConfig());
    if (!session.data?.userId) {
      throw new Error("Log in with your wallet to save your direction.");
    }

    return saveUserReflectionPreference({
      userId: session.data.userId,
      walletAddress: data.walletAddress,
      directionSlug: data.directionSlug,
      projectSlug: data.projectSlug,
    });
  });
