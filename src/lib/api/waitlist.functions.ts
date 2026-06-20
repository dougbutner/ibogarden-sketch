import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { joinWaitlist } from "@/server/services/waitlist.service";
import { trackEvent } from "@/server/services/journey.service";

export const joinCommunityWaitlist = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      source: z.string().max(64).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const result = await joinWaitlist(data.email, data.source ?? "community_page");
    await trackEvent({
      eventType: "waitlist_join",
      eventCategory: "community",
      metadata: { email: data.email, source: data.source ?? "community_page" },
    });
    return result;
  });
