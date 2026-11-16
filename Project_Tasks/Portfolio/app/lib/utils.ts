export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const pad = (value: number) => String(value).padStart(2, "0");

export const formatDate = (iso: string, locale: "en" | "ar") =>
  new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
