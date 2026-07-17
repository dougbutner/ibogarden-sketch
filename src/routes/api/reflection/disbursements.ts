import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { assertReflectionApiKey } from "@/server/lib/reflection-api-auth";
import {
  ReflectionDisbursementError,
  recordReflectionDisbursement,
} from "@/server/services/reflection.service";

const disbursementBodySchema = z.object({
  userAccountId: z.number().int().positive(),
  reflectionDirectionId: z.number().int().positive(),
  holderWallet: z.string().min(32).max(44),
  destinationWallet: z.string().min(32).max(44),
  amountGaine: z.union([z.string().min(1).max(40), z.number().positive()]),
  solanaTxSignature: z.string().min(32).max(128),
  customTitle: z.string().max(50).nullable().optional(),
  destinationType: z.enum(["category", "unregistered"]).optional(),
  destinationSlug: z.string().min(1).max(96).nullable().optional(),
});

export const Route = createFileRoute("/api/reflection/disbursements")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        assertReflectionApiKey(request);

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body." }, { status: 422 });
        }

        const parsed = disbursementBodySchema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: "Validation error", details: parsed.error.flatten() },
            { status: 422 },
          );
        }

        try {
          const result = await recordReflectionDisbursement({
            userAccountId: parsed.data.userAccountId,
            reflectionDirectionId: parsed.data.reflectionDirectionId,
            holderWallet: parsed.data.holderWallet,
            destinationWallet: parsed.data.destinationWallet,
            amountGaine: String(parsed.data.amountGaine),
            solanaTxSignature: parsed.data.solanaTxSignature.trim(),
            customTitle: parsed.data.customTitle ?? null,
            destinationType: parsed.data.destinationType,
            destinationSlug: parsed.data.destinationSlug ?? null,
          });

          return Response.json(result, {
            status: 201,
            headers: { "Cache-Control": "no-store" },
          });
        } catch (err) {
          if (err instanceof ReflectionDisbursementError) {
            return Response.json({ error: err.message }, { status: err.status });
          }
          const message = err instanceof Error ? err.message : "Failed to record disbursement.";
          if (/duplicate|unique|ER_DUP_ENTRY/i.test(message)) {
            return Response.json({ error: "Duplicate solanaTxSignature." }, { status: 409 });
          }
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
