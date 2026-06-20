import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

import {
  buildGoogleAuthUrl,
  isGoogleOAuthConfigured,
  oauthErrorRedirect,
} from "@/server/services/oauth-google.service";
import { getOAuthStateSessionConfig } from "@/server/lib/session";

export const Route = createFileRoute("/api/auth/google")({
  server: {
    handlers: {
      GET: async () => {
        if (!isGoogleOAuthConfigured()) {
          return Response.redirect(oauthErrorRedirect(), 302);
        }

        const state = crypto.randomUUID();
        const oauthSession = await useSession<{ state: string }>(getOAuthStateSessionConfig());
        await oauthSession.update({ state });

        return Response.redirect(buildGoogleAuthUrl(state), 302);
      },
    },
  },
});
