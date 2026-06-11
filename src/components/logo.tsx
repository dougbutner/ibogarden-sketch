import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  alt?: string;
};

export function Logo({ className, size = 120, alt = "ibo.garden" }: LogoProps) {
  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute rounded-full bg-moss"
        style={{ width: "50%", height: "50%" }}
        aria-hidden
      />
      <img
        src={logo}
        alt={alt}
        width={size}
        height={size}
        className="relative z-10 h-full w-full object-contain"
      />
    </div>
  );
}
