import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { fetchGainePoolsData } from "../gaine-pools.server";
import { fetchGaineBalance } from "../solana.server";

export const getGainePools = createServerFn({ method: "GET" }).handler(async () => {
  return fetchGainePoolsData();
});

export const getGaineBalance = createServerFn({ method: "POST" })
  .inputValidator(z.object({ address: z.string().min(32).max(44) }))
  .handler(async ({ data }) => fetchGaineBalance(data.address));
