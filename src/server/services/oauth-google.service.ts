import { getServerConfig } from "@/lib/config.server";
import { SITE_URL } from "@/lib/site";

type GoogleTokenResponse = {
  access_token: string;
  token_type: string;
};

type GoogleUserInfo = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export function isGoogleOAuthConfigured(): boolean {
  const { googleClientId, googleClientSecret, googleRedirectUri } = getServerConfig();
  return Boolean(googleClientId && googleClientSecret && googleRedirectUri);
}

export function buildGoogleAuthUrl(state: string): string {
  const { googleClientId, googleRedirectUri } = getServerConfig();
  if (!googleClientId || !googleRedirectUri) {
    throw new Error("Google OAuth is not configured");
  }

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: googleRedirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleUserInfo> {
  const { googleClientId, googleClientSecret, googleRedirectUri } = getServerConfig();
  if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
    throw new Error("Google OAuth is not configured");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: googleRedirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    throw new Error("Failed to exchange Google authorization code");
  }

  const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    throw new Error("Failed to fetch Google user profile");
  }

  return (await userRes.json()) as GoogleUserInfo;
}

export function oauthSuccessRedirect(): string {
  return `${SITE_URL}/community?oauth=success`;
}

export function oauthErrorRedirect(): string {
  return `${SITE_URL}/community?oauth=error`;
}
