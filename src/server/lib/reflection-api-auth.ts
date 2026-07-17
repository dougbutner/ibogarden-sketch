import { getServerConfig } from "@/lib/config.server";
import { safeEqual } from "@/server/lib/crypto";

/** Throws a Response if the reflection API key is missing or invalid. */
export function assertReflectionApiKey(request: Request): void {
  const { reflectionApiKey } = getServerConfig();
  if (!reflectionApiKey) {
    throw new Response(JSON.stringify({ error: "Reflection API is not configured." }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headerKey = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const altKey = request.headers.get("x-reflection-api-key")?.trim();
  const provided = headerKey || altKey;

  if (!provided || !safeEqual(provided, reflectionApiKey)) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
