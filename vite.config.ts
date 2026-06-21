import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Cloudflare's local runtime (workerd) needs macOS 13.5+. Use Nitro for local dev/preview.
const useCloudflare =
  process.env.npm_lifecycle_event === "build" || process.env.npm_lifecycle_event === "deploy";

export default defineConfig({
  plugins: [
    ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : [nitro()]),
    tsconfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    tailwindcss(),
  ],
});
