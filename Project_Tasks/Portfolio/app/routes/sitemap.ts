import { projects } from "~/data/projects";
import { site, getSiteUrl } from "~/data/site";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function loader() {
  const base = getSiteUrl();
  const paths = ["/", "/cv", ...projects.map((project) => `/work/${project.slug}`)];

  const altFor = (path: string) => {
    const en = path === "/ar" ? "/" : path.startsWith("/ar/") ? path.slice(3) : path;
    const ar = en === "/" ? "/ar" : `/ar${en}`;
    return { en, ar };
  };

  const entries = paths.flatMap((path) => {
    const { en, ar } = altFor(path);
    return [en, ar].map((localized) => {
      const alternates = [
        `<xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${base}${en}`)}"/>`,
        `<xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(`${base}${ar}`)}"/>`,
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${base}${en}`)}"/>`,
      ]
        .map((line) => `    ${line}`)
        .join("\n");

      const isHome = localized === "/" || localized === "/ar";
      const isCv = localized.endsWith("/cv");

      return [
        "  <url>",
        `    <loc>${escapeXml(`${base}${localized}`)}</loc>`,
        `    <lastmod>${site.updatedAt}</lastmod>`,
        `    <changefreq>${isHome ? "monthly" : "yearly"}</changefreq>`,
        `    <priority>${isHome ? "1.0" : isCv ? "0.7" : "0.8"}</priority>`,
        alternates,
        "  </url>",
      ].join("\n");
    });
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
