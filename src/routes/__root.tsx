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
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

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
      { title: "ibo.garden: GAINE Token & Ethical Iboga Marketplace" },
      { name: "description", content: "GAINE SPL token and marketplace for ethically sourced Iboga. Nagoya Protocol-aligned sourcing, network-verified listings, and on-chain traceability." },
      { property: "og:title", content: "ibo.garden: GAINE Token & Ethical Iboga Marketplace" },
      { property: "og:description", content: "GAINE SPL token and marketplace for ethically sourced Iboga. Nagoya Protocol-aligned sourcing, network-verified listings, and on-chain traceability." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ibo.garden: GAINE Token & Ethical Iboga Marketplace" },
      { name: "twitter:description", content: "GAINE SPL token and marketplace for ethically sourced Iboga. Nagoya Protocol-aligned sourcing, network-verified listings, and on-chain traceability." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a2a7676d-6923-4c9f-84ef-0ca0c4d2da34/id-preview-8d9f478c--cb0a761f-7cfd-4846-9011-00acb9741abe.lovable.app-1781442611467.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a2a7676d-6923-4c9f-84ef-0ca0c4d2da34/id-preview-8d9f478c--cb0a761f-7cfd-4846-9011-00acb9741abe.lovable.app-1781442611467.png" },
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
      <div className="min-h-screen flex flex-col bg-earth text-forest">
        <SiteHeader />
        <main className="flex-1 pb-12">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
