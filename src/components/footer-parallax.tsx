"use client";

import { useMemo } from "react";
import { randomIbogaPhoto } from "@/assets/iboga-photos";
import { useParallax } from "@/hooks/useParallax";

export function FooterParallax() {
  const photo = useMemo(() => randomIbogaPhoto(), []);
  const parallax = useParallax(0.35);

  return (
    <div
      className="relative h-28 md:h-36 overflow-hidden"
      aria-hidden
    >
      <img
        src={photo}
        alt=""
        ref={parallax.ref}
        style={parallax.style}
        data-parallax-speed={parallax["data-parallax-speed"]}
        className="absolute inset-x-0 w-full h-[140%] -top-[20%] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-earth/20 via-forest/35 to-forest" />
    </div>
  );
}
