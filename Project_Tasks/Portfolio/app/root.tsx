import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router";

import stylesheet from "~/app.css?url";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { getLocaleFromPathname, dirOf, I18nProvider, ui } from "~/i18n";
import { THEME_SCRIPT } from "~/lib/theme";

const fontHref =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: fontHref },
  { rel: "stylesheet", href: stylesheet },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = getLocaleFromPathname(new URL(request.url).pathname);
  return { locale };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#f7f7f4"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#07070b"
        />
        <Meta />
        <Links />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <I18nProvider locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
          >
            {ui[locale].common.skipToContent}
          </a>
          <span id="top" aria-hidden="true" />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </I18nProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 py-24 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
        {is404 ? "404" : "Error"}
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        {is404 ? "This page took a different route." : "Something went wrong."}
      </h1>
      <p className="mt-4 max-w-lg text-muted">
        {is404
          ? "The link may be broken, or the page may have moved."
          : "An unexpected error occurred while rendering this page. Please try again."}
      </p>
      <a
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg"
      >
        Back home
      </a>
    </div>
  );
}
