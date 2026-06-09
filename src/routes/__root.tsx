import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { StickyCtas } from "../components/sticky-ctas";

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
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

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
      { title: "ibo.garden — Heal the Planet. Root in Vitality." },
      { name: "description", content: "Network-rooted Iboga ecosystem: facilitator directory, ethical sourcing, GAINE token, and Gabon impact." },
      { property: "og:title", content: "ibo.garden — Heal the Planet. Root in Vitality." },
      { property: "og:description", content: "Network-rooted Iboga ecosystem: facilitator directory, ethical sourcing, GAINE token, and Gabon impact." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ibo.garden — Heal the Planet. Root in Vitality." },
      { name: "twitter:description", content: "Network-rooted Iboga ecosystem: facilitator directory, ethical sourcing, GAINE token, and Gabon impact." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5b172841-0aa9-478b-ad85-f99ec7a2d6d6" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5b172841-0aa9-478b-ad85-f99ec7a2d6d6" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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
        <main className="flex-1 pb-32 md:pb-12">
          <Outlet />
        </main>
        <SiteFooter />
        <StickyCtas />
      </div>
    </QueryClientProvider>
  );
}
