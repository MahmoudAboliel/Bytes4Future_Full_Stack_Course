/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — edit this file first.
 *  Everything else (pages, CV, sitemap, structured data) follows.
 * ─────────────────────────────────────────────────────────────
 */

/** Production URL. Used for canonical links, sitemap and Open Graph tags. */
export const SITE_URL = "https://mahmoudabulail.vercel.app";

/** Optional: set SITE_URL in Vercel → Project → Environment Variables to override. */
export const getSiteUrl = () => {
  const envUrl =
    typeof process !== "undefined" ? process.env?.SITE_URL : undefined;
  return (envUrl ?? SITE_URL).replace(/\/$/, "");
};

export const site = {
  url: SITE_URL,
  locales: ["en", "ar"] as const,
  defaultLocale: "en" as const,
  /** Shown in the footer + CV. Update when you change the content. */
  updatedAt: "2026-11-13",
  ogImage: "/og.png",
  /** Google Search Console → "HTML tag" verification value (content="..." only). */
  googleVerification: "",
  /**
   * Drop your verification file in /public and put its name here,
   * e.g. "google1a2b3c4d5e6f.html".
   */
  googleVerificationFile: "",
  socials: {
    GitHub: "https://github.com/mahmoudabulail",
    LinkedIn: "https://linkedin.com/in/mahmoudabulail",
    Email: "mahmoudabulail1998@gmail.com",
    Phone: "+963938293299",
  },
  contact: {
    email: "mahmoudabulail1998@gmail.com",
    phone: "+963 938 293 299",
    location: {
      en: "Damascus, Syria",
      ar: "دمشق، سوريا",
    },
    timezone: "GMT+3",
  },
  /** Downloadable CV files, generated from the same data by `npm run assets`. */
  cv: {
    en: "/files/Mahmoud-Abulail-CV-EN.pdf",
    ar: "/files/Mahmoud-Abulail-CV-AR.pdf",
  },
};
