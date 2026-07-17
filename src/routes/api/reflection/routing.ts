import { createFileRoute } from "@tanstack/react-router";

import { assertReflectionApiKey } from "@/server/lib/reflection-api-auth";
import { listReflectionRouting } from "@/server/services/reflection.service";

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
