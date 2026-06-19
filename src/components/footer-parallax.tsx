"use client";

import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { randomIbogaTexture } from "@/assets/iboga-textures";
import { useElementParallax } from "@/hooks/useParallax";

export function FooterParallax() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const photo = useMemo(() => randomIbogaTexture(), [pathname]);
  const parallax = useElementParallax(0.35);

  return (
    <div className="relative h-28 md:h-36 overflow-hidden bg-forest" aria-hidden>
      <img
        src={photo}
        alt=""
        ref={parallax.ref}
        style={parallax.style}
        data-parallax-speed={parallax["data-parallax-speed"]}
        className="absolute inset-x-0 w-full h-[220%] object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-earth/20 via-forest/35 to-forest" />
    </div>
  );
}
