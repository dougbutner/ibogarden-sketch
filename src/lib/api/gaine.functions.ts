import { createServerFn } from "@tanstack/react-start";

import { fetchGainePoolsData } from "../gaine-pools.server";

export const getGainePools = createServerFn({ method: "GET" }).handler(async () => {
  return fetchGainePoolsData();
});
