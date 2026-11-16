import { createContext, useContext } from "react";
import type { Locale, Localized } from "~/data/types";
import { ui, type UI } from "./ui";

export { ui };
export type { UI };
export const LOCALES: Locale[] = ["en", "ar"];

export const isLocale = (value: string): value is Locale =>
  value === "en" || value === "ar";

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Arabic lives under /ar, English at the root. */
export const localePrefix = (locale: Locale) => (locale === "ar" ? "/ar" : "");

export const pathFor = (locale: Locale, path: string) => {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean === "/" ? "/" : clean;
  return clean === "/" ? "/ar" : `/ar${clean}`;
};

export const getLocaleFromPathname = (pathname: string): Locale =>
  pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";

/** Removes the /ar prefix; the result always starts with "/". */
export const stripLocale = (pathname: string) => {
  if (pathname === "/ar") return "/";
  if (pathname.startsWith("/ar/")) return pathname.slice(3);
  return pathname;
};

export const getLocale = (request: Request) =>
  getLocaleFromPathname(new URL(request.url).pathname);

/** Returns the same page in the other language (keeps query + hash). */
export const alternatePath = (
  pathname: string,
  search: string,
  hash: string,
  target: Locale,
) => {
  const base = stripLocale(pathname);
  return `${pathFor(target, base)}${search}${hash}`;
};

export const pick = <T,>(value: Localized<T>, locale: Locale): T => value[locale];

const I18nContext = createContext<Locale>("en");

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(I18nContext);
}

export function useI18n(): { locale: Locale; dir: "rtl" | "ltr"; t: UI } {
  const locale = useLocale();
  return { locale, dir: dirOf(locale), t: ui[locale] };
}
