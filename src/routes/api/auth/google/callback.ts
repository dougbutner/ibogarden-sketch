import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

import {
  exchangeGoogleCode,
  isGoogleOAuthConfigured,
  oauthErrorRedirect,
  oauthSuccessRedirect,
} from "@/server/services/oauth-google.service";
import { upsertGoogleUser } from "@/server/services/holder.service";
import { getOAuthStateSessionConfig, getUserSessionConfig, type UserSessionData } from "@/server/lib/session";

export const Route = createFileRoute("/api/auth/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isGoogleOAuthConfigured()) {
          return Response.redirect(oauthErrorRedirect(), 302);
        }

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (error || !code || !state) {
          return Response.redirect(oauthErrorRedirect(), 302);
        }

        const oauthSession = await useSession<{ state: string }>(getOAuthStateSessionConfig());

        if (oauthSession.data?.state !== state) {
          return Response.redirect(oauthErrorRedirect(), 302);
        }

        try {
          const profile = await exchangeGoogleCode(code);
          const user = await upsertGoogleUser({
            providerUserId: profile.id,
            email: profile.email,
            displayName: profile.name,
            avatarUrl: profile.picture,
          });

          const userSession = await useSession<UserSessionData>(getUserSessionConfig());
          await userSession.update({
            userId: user.userId,
            isHolder: false,
            email: user.email,
            displayName: user.displayName,
          });

          await oauthSession.clear();

          return Response.redirect(oauthSuccessRedirect(), 302);
        } catch {
          return Response.redirect(oauthErrorRedirect(), 302);
        }
      },
    },
  },
});
