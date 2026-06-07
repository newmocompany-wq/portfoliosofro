import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link } from "react-router-dom";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-electric">404 • Signal lost</p>
        <h1 className="mt-2 font-display text-5xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The frequency you tuned into doesn't exist or has been retired.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground hover:opacity-90">
          Back to homepage
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-electric px-4 py-2 text-sm font-medium text-electric-foreground">Try again</button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">Go home</a>
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
      { title: "Prof. Karim Mansour — Communications & Electronics Engineering" },
      { name: "description", content: "Academic portfolio of Prof. Karim Mansour, Head of Communications & Electronics Engineering. Research, courses, achievements, and publications." },
      { property: "og:title", content: "Prof. Karim Mansour — Communications & Electronics Engineering" },
      { property: "og:description", content: "Academic portfolio of Prof. Karim Mansour, Head of Communications & Electronics Engineering. Research, courses, achievements, and publications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Prof. Karim Mansour — Communications & Electronics Engineering" },
      { name: "twitter:description", content: "Academic portfolio of Prof. Karim Mansour, Head of Communications & Electronics Engineering. Research, courses, achievements, and publications." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4a4a6930-41c1-43e8-8d56-1c9a54b70847/id-preview-e2892bbe--60983b9a-e959-4c2f-a846-4e5a31283032.lovable.app-1780614035155.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4a4a6930-41c1-43e8-8d56-1c9a54b70847/id-preview-e2892bbe--60983b9a-e959-4c2f-a846-4e5a31283032.lovable.app-1780614035155.png" },
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
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
          <Toaster theme="dark" position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
