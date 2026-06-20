import { createFileRoute } from "@tanstack/react-router";

import { getServerConfig } from "@/lib/config.server";
import { safeEqual } from "@/server/lib/crypto";
import { listReflectionRouting } from "@/server/services/reflection.service";

function assertReflectionApiKey(request: Request) {
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

export const Route = createFileRoute("/api/reflection/routing")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        assertReflectionApiKey(request);

        const payload = await listReflectionRouting();
        return Response.json(payload, {
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
