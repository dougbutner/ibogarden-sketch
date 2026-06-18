import { useQuery } from "@tanstack/react-query";

import { getGainePools } from "@/lib/api/gaine.functions";
import type { GainePoolsPayload } from "@/types/gaine-pools";

export function useGainePools() {
  return useQuery<GainePoolsPayload>({
    queryKey: ["gaine-pools"],
    queryFn: () => getGainePools(),
    staleTime: 60_000,
    refetchInterval: 120_000,
    retry: 2,
  });
}
