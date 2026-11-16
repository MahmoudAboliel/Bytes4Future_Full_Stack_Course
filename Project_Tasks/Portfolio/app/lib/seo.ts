import type { MetaDescriptor } from "react-router";
import type { Locale, Localized, Project } from "~/data/types";
import { getSiteUrl, site } from "~/data/site";
import { pick } from "~/i18n";
import { profile } from "~/data/profile";
import { projects } from "~/data/projects";

const absolute = (path: string) => {
  const base = getSiteUrl();
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

type SeoInput = {
  title: string;
  description: string;
  /** Path in the current language, e.g. "/" or "/ar/work/go-bus". */
  path: string;
  locale: Locale;
  image?: string;
  type?: "website" | "profile" | "article";
  keywords?: string[];
  noindex?: boolean;
};

/** English path of the current page (used for hreflang + canonical). */
const englishPath = (path: string) => {
  if (path === "/ar") return "/";
  if (path.startsWith("/ar/")) return path.slice(3);
  return path;
};

export function seo({
  title,
  description,
  path,
  locale,
  image = site.ogImage,
  type = "website",
  keywords,
  noindex,
}: SeoInput): MetaDescriptor[] {
  const en = englishPath(path);
  const ar = en === "/" ? "/ar" : `/ar${en}`;
  const canonical = absolute(path);
  const imageUrl = absolute(image);

  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { name: "author", content: profile.nameLatin },
    { property: "og:type", content: type },
    { property: "og:site_name", content: profile.nameLatin },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: locale === "ar" ? "ar_SY" : "en_US" },
    {
      property: "og:locale:alternate",
      content: locale === "ar" ? "en_US" : "ar_SY",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { tagName: "link", rel: "canonical", href: absolute(path) },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: absolute(en) },
    { tagName: "link", rel: "alternate", hrefLang: "ar", href: absolute(ar) },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: absolute(en),
    },
  ];

  if (keywords?.length) {
    tags.push({ name: "keywords", content: keywords.join(", ") });
  }
  if (noindex) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
  }
  return tags;
}

/* ── Structured data ─────────────────────────────────────────── */

const sameAs = [site.socials.GitHub, site.socials.LinkedIn];

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: pick(profile.name, locale),
    alternateName: profile.nameLatin,
    jobTitle: pick(profile.role, locale),
    description: pick(profile.summary, locale),
    url: getSiteUrl(),
    email: `mailto:${site.contact.email}`,
    telephone: site.contact.phone,
    image: absolute(profile.photo.hero),
    address: {
      "@type": "PostalAddress",
      addressLocality: locale === "ar" ? "دمشق" : "Damascus",
      addressCountry: "SY",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: locale === "ar" ? "جامعة دمشق" : "University of Damascus",
    },
    knowsLanguage: ["ar", "en"],
    sameAs,
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "React Native",
      "MongoDB",
      "PostgreSQL",
      "Tailwind CSS",
      "REST APIs",
    ],
  };
}

export function profilePageJsonLd(locale: Locale) {
  const en = locale === "ar" ? "/ar" : "/";
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absolute(en),
    inLanguage: locale,
    mainEntity: personJsonLd(locale),
    hasPart: projects.map((project) => ({
      "@type": "CreativeWork",
      name: pick(project.title, locale),
      url: absolute(locale === "ar" ? `/ar/work/${project.slug}` : `/work/${project.slug}`),
      about: pick(project.category, locale),
    })),
  };
}

export function projectJsonLd(project: Project, locale: Locale) {
  const path = locale === "ar" ? `/ar/work/${project.slug}` : `/work/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: pick(project.title, locale),
    headline: pick(project.tagline, locale),
    description: pick(project.summary, locale),
    url: absolute(path),
    inLanguage: locale,
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    author: {
      "@type": "Person",
      name: profile.nameLatin,
      url: getSiteUrl(),
    },
    creator: {
      "@type": "Person",
      name: profile.nameLatin,
      url: getSiteUrl(),
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function projectMetaPath(slug: string, locale: Locale) {
  return locale === "ar" ? `/ar/work/${slug}` : `/work/${slug}`;
}

export const localizedField = (value: Localized, locale: Locale) => value[locale];
