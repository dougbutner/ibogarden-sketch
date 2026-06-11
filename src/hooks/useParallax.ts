import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEventHandler,
  type RefCallback,
} from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type ParallaxProps = {
  ref: RefCallback<HTMLElement>;
  style: CSSProperties;
  "data-parallax-speed": number;
};

export type HoverParallaxProps = {
  imageRef: RefCallback<HTMLElement>;
  imageStyle: CSSProperties;
  "data-parallax-speed": number;
  onMouseMove: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
};

let scrollY = 0;
let rafId: number | null = null;
const scrollSubscribers = new Set<(y: number) => void>();

function onScroll() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    scrollY = window.scrollY;
    rafId = null;
    scrollSubscribers.forEach((cb) => cb(scrollY));
  });
}

function subscribeScroll(cb: (y: number) => void) {
  scrollSubscribers.add(cb);
  if (scrollSubscribers.size === 1) {
    scrollY = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  cb(scrollY);
  return () => {
    scrollSubscribers.delete(cb);
    if (scrollSubscribers.size === 0) {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
}

function clampSpeed(speed: number) {
  return Math.min(0.8, Math.max(0.3, speed));
}

function parallaxTransform(y: number, speed: number) {
  return `translateY(${y * speed}px)`;
}

export function useParallax(speed: number): ParallaxProps {
  const isMobile = useIsMobile();
  const clampedSpeed = clampSpeed(speed);
  const elementRef = useRef<HTMLElement | null>(null);
  const speedRef = useRef(clampedSpeed);
  speedRef.current = clampedSpeed;

  useEffect(() => {
    if (isMobile) {
      if (elementRef.current) elementRef.current.style.transform = "";
      return;
    }

    return subscribeScroll((y) => {
      if (elementRef.current) {
        elementRef.current.style.transform = parallaxTransform(y, speedRef.current);
      }
    });
  }, [isMobile]);

  const ref = useCallback<RefCallback<HTMLElement>>(
    (node) => {
      elementRef.current = node;
      if (node && !isMobile) {
        node.style.transform = parallaxTransform(scrollY, speedRef.current);
      }
    },
    [isMobile],
  );

  return {
    ref,
    style: isMobile ? {} : { willChange: "transform" },
    "data-parallax-speed": clampedSpeed,
  };
}

export function useHoverParallax(speed = 0.12): HoverParallaxProps {
  const isMobile = useIsMobile();
  const imageRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const applyTransform = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      const image = imageRef.current;
      if (!container || !image || isMobile) return;

      const rect = container.getBoundingClientRect();
      const offsetY = (clientY - rect.top - rect.height / 2) / rect.height;
      image.style.transform = `translateY(${offsetY * speed * 100}px)`;
    },
    [isMobile, speed],
  );

  const resetTransform = useCallback(() => {
    if (imageRef.current) imageRef.current.style.transform = "";
  }, []);

  const onMouseMove = useCallback<MouseEventHandler<HTMLElement>>(
    (e) => {
      if (isMobile) return;
      containerRef.current = e.currentTarget;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        applyTransform(e.clientY);
      });
    },
    [isMobile, applyTransform],
  );

  const onMouseLeave = useCallback<MouseEventHandler<HTMLElement>>(
    () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      resetTransform();
    },
    [resetTransform],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const imageRefCallback = useCallback<RefCallback<HTMLElement>>((node) => {
    imageRef.current = node;
  }, []);

  return {
    imageRef: imageRefCallback,
    imageStyle: isMobile ? {} : { willChange: "transform" },
    "data-parallax-speed": speed,
    onMouseMove,
    onMouseLeave,
  };
}
