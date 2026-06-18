import { cn } from "@/lib/utils";

type GainePoolShareRingProps = {
  percent: number;
  size?: number;
  className?: string;
};

export function GainePoolShareRing({ percent, size = 36, className }: GainePoolShareRingProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: size, height: size }}
      title={`Project wallet owns ${clamped.toFixed(1)}% of pool liquidity`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gaine-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--gaine-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="absolute text-[9px] font-semibold tabular-nums"
        style={{ color: "var(--gaine-text)" }}
      >
        {clamped >= 99.95 ? "100" : clamped < 0.05 ? "0" : clamped.toFixed(0)}%
      </span>
    </div>
  );
}
