"use client";

import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { assignIbogaSurfaceTextures } from "@/lib/assign-iboga-surface-textures";

export function IbogaSurfaceTextures() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    assignIbogaSurfaceTextures();
  }, [pathname]);

  return null;
}
