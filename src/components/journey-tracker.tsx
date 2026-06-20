"use client";

import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

import { trackPageView } from "@/lib/api/journey.functions";

export function JourneyTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.search });

  useEffect(() => {
    const params = new URLSearchParams(search);
    void trackPageView({
      data: {
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        refCode: params.get("ref") ?? params.get("m") ?? undefined,
      },
    }).catch(() => {
      /* non-blocking analytics */
    });
  }, [pathname, search]);

  return null;
}
