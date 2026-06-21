import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { FooterParallax } from "../components/footer-parallax";
import { IbogaSurfaceTextures } from "../components/iboga-surface-textures";
import { WalletProvider } from "../contexts/wallet-context";
import { LocaleProvider } from "../contexts/locale-context";
import { JourneyTracker } from "../components/journey-tracker";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-earth px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-forest">404</h1>
        <h2 className="mt-4 font-serif italic text-2xl text-forest">Path not found in the garden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page has not yet taken root. Return to the home of ibo.garden.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3 text-xs font-semibold uppercase tracking-widest text-earth hover:bg-moss transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-earth px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl italic text-forest">Something disturbed the soil</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not load this page. Try again, or return home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-forest px-6 py-3 text-xs font-semibold uppercase tracking-widest text-earth hover:bg-moss transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-forest/20 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-forest hover:bg-forest hover:text-earth transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ibo.garden: Gabon Iboga · GAINE Token · Ethical Sourcing" },
      { name: "description", content: "Ethical Iboga sourcing from Gabon. GAINE token, marketplace access, and on-chain traceability under Decree 0239." },
      { property: "og:title", content: "ibo.garden: Gabon Iboga · GAINE Token · Ethical Sourcing" },
      { property: "og:description", content: "Ethical Iboga sourcing from Gabon. GAINE token, marketplace access, and on-chain traceability under Decree 0239." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ibo.garden: Gabon Iboga · GAINE Token · Ethical Sourcing" },
      { name: "twitter:description", content: "Ethical Iboga sourcing from Gabon. GAINE token, marketplace access, and on-chain traceability under Decree 0239." },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <WalletProvider>
          <JourneyTracker />
          <IbogaSurfaceTextures />
          <div className="min-h-screen flex flex-col bg-earth text-forest">
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <FooterParallax />
            <SiteFooter />
          </div>
        </WalletProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}
