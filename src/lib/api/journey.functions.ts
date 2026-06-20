import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import { trackEvent } from "@/server/services/journey.service";
import { getUserSessionConfig } from "@/server/lib/session";

export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      path: z.string().max(512),
      referrer: z.string().max(512).optional(),
      refCode: z.string().max(64).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await useSession(getUserSessionConfig());
    const userId = (session.data as { userId?: number } | undefined)?.userId;

    await trackEvent({
      userAccountId: userId ?? null,
      eventType: "page_view",
      eventCategory: "navigation",
      path: data.path,
      referrer: data.referrer,
      refCode: data.refCode,
    });

    return { ok: true as const };
  });
