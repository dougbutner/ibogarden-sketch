import { IBOGA_TEXTURES } from "@/assets/iboga-textures";

const ROUNDED = ["rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl"] as const;
const BORDER_ONLY = ["border-b", "border-t", "border-l", "border-r", "border-x", "border-y"] as const;

function isIbogaSurface(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.hasAttribute("data-no-texture")) return false;
  if (el.hasAttribute("data-iboga-static-panel")) return false;
  if (el.classList.contains("iboga-surface-row")) return true;
  if (el.classList.contains("gaine-surface-card")) return true;
  if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(el.tagName)) return false;

  const cn = el.className;
  if (typeof cn !== "string") return false;
  if (!ROUNDED.some((r) => cn.includes(r))) return false;
  if (cn.includes("rounded-full") || cn.includes("rounded-sm")) return false;
  if (!cn.includes("border") || cn.includes("border-0") || cn.includes("border-none")) return false;
  if (BORDER_ONLY.some((b) => cn.includes(b))) return false;

  return cn.includes("bg-white") || (cn.includes("bg-bone") && !cn.includes("bg-bone/"));
}

function randomTexture(): string {
  return IBOGA_TEXTURES[Math.floor(Math.random() * IBOGA_TEXTURES.length)]!;
}

export function assignIbogaSurfaceTextures(root: ParentNode = document) {
  root.querySelectorAll("div, article, section, li, tr.iboga-surface-row, .gaine-surface-card").forEach((el) => {
    if (!isIbogaSurface(el)) return;
    el.style.setProperty("--iboga-texture", `url("${randomTexture()}")`);
  });
}
