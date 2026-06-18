"use client";

/**
 * Bounce physics inspired by:
 * - https://codepen.io/jh3y/pen/ZYYqYgv — resistance + release feel
 * - https://codepen.io/GreenSock/pen/vYQbZYy — inertia and bounds
 * - https://codepen.io/nelledejones/pen/gOOPWrK — unlock bounce cue
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GAINE_TOKEN_IMAGE } from "@/data/gaine";

const TRIPLE_TAP_MS = 550;
const TOKEN_SIZE = 220;
const FRICTION = 0.988;
const BOUNCE_DAMPING = 0.68;
const SPRING_CLICK = 0.22;
const SCROLL_FORCE = 1.1;
const EDGE_PAD = 12;
const UNLOCK_BURST = 9;

type Vec2 = { x: number; y: number };

function viewportCenterOffset(rect: DOMRect): Vec2 {
  return {
    x: rect.left + rect.width / 2 - window.innerWidth / 2,
    y: rect.top + rect.height / 2 - window.innerHeight / 2,
  };
}

export function GaineDraggableToken() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLImageElement>(null);
  const [bounceMode, setBounceMode] = useState(false);
  const [unlockPulse, setUnlockPulse] = useState(false);
  const [pos, setPos] = useState<Vec2>({ x: 0, y: 0 });
  const [spin, setSpin] = useState(0);
  const [mounted, setMounted] = useState(false);

  const bounceModeRef = useRef(false);
  const posRef = useRef<Vec2>({ x: 0, y: 0 });
  const velRef = useRef<Vec2>({ x: 0, y: 0 });
  const spinRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockingRef = useRef(false);

  const getBounds = useCallback(() => {
    const half = TOKEN_SIZE / 2;
    return {
      maxX: window.innerWidth / 2 - half - EDGE_PAD,
      maxY: window.innerHeight / 2 - half - EDGE_PAD,
    };
  }, []);

  const stopPhysics = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const syncRender = useCallback(() => {
    setPos({ ...posRef.current });
    setSpin(spinRef.current);
  }, []);

  const physicsStep = useCallback(() => {
    if (!bounceModeRef.current || lockingRef.current) {
      return;
    }

    const bounds = getBounds();
    let { x, y } = posRef.current;
    let { x: vx, y: vy } = velRef.current;

    vx *= FRICTION;
    vy *= FRICTION;
    spinRef.current *= 0.96;

    x += vx;
    y += vy;

    if (x < -bounds.maxX) {
      x = -bounds.maxX;
      vx = Math.abs(vx) * BOUNCE_DAMPING;
    } else if (x > bounds.maxX) {
      x = bounds.maxX;
      vx = -Math.abs(vx) * BOUNCE_DAMPING;
    }

    if (y < -bounds.maxY) {
      y = -bounds.maxY;
      vy = Math.abs(vy) * BOUNCE_DAMPING;
    } else if (y >= bounds.maxY && vy > 0) {
      y = bounds.maxY;
      const scrollRoom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;

      if (scrollRoom > 1) {
        const scrollBy = Math.min(vy * SCROLL_FORCE, scrollRoom);
        window.scrollBy({ top: scrollBy, left: 0, behavior: "instant" });
        vy *= 0.9;
        vx *= 0.985;
        spinRef.current += vx * 0.04;
      } else {
        vy = -Math.abs(vy) * BOUNCE_DAMPING;
      }
    }

    posRef.current = { x, y };
    velRef.current = { x: vx, y: vy };
    syncRender();

    rafRef.current = requestAnimationFrame(physicsStep);
  }, [getBounds, syncRender]);

  const startPhysics = useCallback(() => {
    stopPhysics();
    rafRef.current = requestAnimationFrame(physicsStep);
  }, [physicsStep, stopPhysics]);

  const applySpringClick = useCallback(() => {
    const { x, y } = posRef.current;
    velRef.current.x += -x * SPRING_CLICK;
    velRef.current.y += -y * SPRING_CLICK;
    spinRef.current += (Math.random() - 0.5) * 28;
    startPhysics();
  }, [startPhysics]);

  const enterBounceMode = useCallback(() => {
    const token = tokenRef.current;
    if (!token) {
      return;
    }

    const offset = viewportCenterOffset(token.getBoundingClientRect());
    const angle = Math.random() * Math.PI * 2;
    posRef.current = offset;
    velRef.current = {
      x: Math.cos(angle) * UNLOCK_BURST,
      y: Math.sin(angle) * UNLOCK_BURST,
    };
    spinRef.current = (Math.random() - 0.5) * 40;

    bounceModeRef.current = true;
    setBounceMode(true);
    setUnlockPulse(true);
    window.setTimeout(() => setUnlockPulse(false), 800);
    syncRender();
    startPhysics();
  }, [startPhysics, syncRender]);

  const exitBounceMode = useCallback(() => {
    lockingRef.current = true;
    stopPhysics();

    const anchor = anchorRef.current;
    if (!anchor) {
      bounceModeRef.current = false;
      lockingRef.current = false;
      setBounceMode(false);
      posRef.current = { x: 0, y: 0 };
      velRef.current = { x: 0, y: 0 };
      spinRef.current = 0;
      syncRender();
      return;
    }

    const target = viewportCenterOffset(anchor.getBoundingClientRect());
    const start = { ...posRef.current };
    const startSpin = spinRef.current;
    const duration = 520;
    const startTime = performance.now();

    const animateHome = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - (1 - t) ** 3;

      posRef.current = {
        x: start.x + (target.x - start.x) * eased,
        y: start.y + (target.y - start.y) * eased,
      };
      spinRef.current = startSpin * (1 - eased);
      syncRender();

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animateHome);
      } else {
        bounceModeRef.current = false;
        lockingRef.current = false;
        setBounceMode(false);
        posRef.current = { x: 0, y: 0 };
        velRef.current = { x: 0, y: 0 };
        spinRef.current = 0;
        syncRender();
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animateHome);
  }, [stopPhysics, syncRender]);

  const toggleBounceMode = useCallback(() => {
    if (bounceModeRef.current) {
      exitBounceMode();
    } else {
      enterBounceMode();
    }
  }, [enterBounceMode, exitBounceMode]);

  const registerTap = useCallback(() => {
    tapCount.current += 1;
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    if (tapCount.current >= 3) {
      tapCount.current = 0;
      toggleBounceMode();
      return;
    }

    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, TRIPLE_TAP_MS);
  }, [toggleBounceMode]);

  useEffect(() => {
    setMounted(true);
    return () => stopPhysics();
  }, [stopPhysics]);

  const onTokenClick = (event: React.PointerEvent<HTMLImageElement>) => {
    event.preventDefault();

    if (lockingRef.current) {
      return;
    }

    if (!bounceModeRef.current) {
      registerTap();
      return;
    }

    tapCount.current += 1;
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    if (tapCount.current >= 3) {
      tapCount.current = 0;
      exitBounceMode();
      return;
    }

    tapTimer.current = setTimeout(() => {
      const clicks = tapCount.current;
      tapCount.current = 0;

      if (!bounceModeRef.current || clicks === 0) {
        return;
      }

      for (let i = 0; i < clicks; i += 1) {
        applySpringClick();
      }
    }, 280);
  };

  const tokenVisual = (
    <div
      style={{
        transform: `rotate(${spin}deg)`,
        transition: bounceMode ? "none" : undefined,
      }}
    >
      <div className={unlockPulse ? "gaine-token-unlock" : ""}>
        <img
        ref={tokenRef}
        src={GAINE_TOKEN_IMAGE}
        alt="GAINE token"
        width={TOKEN_SIZE}
        height={TOKEN_SIZE}
        draggable={false}
        onPointerDown={onTokenClick}
        className={[
          "size-[220px] select-none object-contain touch-none",
          bounceMode ? "cursor-pointer" : "cursor-pointer",
        ].join(" ")}
        style={{
          filter: bounceMode
            ? "drop-shadow(0 22px 44px color-mix(in srgb, var(--gaine-accent) 55%, transparent))"
            : undefined,
        }}
      />
      </div>
    </div>
  );

  const floatingToken =
    mounted &&
    bounceMode &&
    createPortal(
      <div
        className="pointer-events-none fixed inset-0 z-[80]"
        aria-hidden={false}
      >
        <div
          className="pointer-events-auto absolute will-change-transform"
          style={{
            left: `calc(50% + ${pos.x}px)`,
            top: `calc(50% + ${pos.y}px)`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {tokenVisual}
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <div
        ref={anchorRef}
        className="relative mx-auto mb-6 h-[220px] w-full max-w-[min(100%,340px)]"
      >
        <div
          className="pointer-events-none absolute inset-0 scale-125 opacity-35 blur-3xl"
          style={{ background: "var(--gaine-accent)" }}
          aria-hidden
        />

        {!bounceMode && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {tokenVisual}
          </div>
        )}

        {bounceMode && (
          <div
            className="absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--gaine-accent) 50%, transparent), transparent 70%)",
            }}
            aria-hidden
          />
        )}
      </div>

      {floatingToken}

      <span className="sr-only" aria-live="polite">
        {bounceMode
          ? "Bounce mode active. Click to sling toward center. Triple-tap again to lock."
          : ""}
      </span>
    </>
  );
};
