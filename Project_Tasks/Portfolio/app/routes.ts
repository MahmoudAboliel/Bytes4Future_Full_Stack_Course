import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Two languages, one set of route modules.
 * English lives at the root, Arabic under /ar — real URLs, real SSR HTML,
 * and proper hreflang pairs for search engines.
 */
export default [
  index("routes/home.tsx", { id: "home-en" }),
  route("work/:slug", "routes/project.tsx", { id: "project-en" }),
  route("cv", "routes/cv.tsx", { id: "cv-en" }),

  route("ar", "routes/home.tsx", { id: "home-ar" }),
  route("ar/work/:slug", "routes/project.tsx", { id: "project-ar" }),
  route("ar/cv", "routes/cv.tsx", { id: "cv-ar" }),

  route("og", "routes/og.tsx"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("404", "routes/not-found.tsx"),
  route("*", "routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
