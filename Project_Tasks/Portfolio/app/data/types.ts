export type Locale = "en" | "ar";

/** Every user-facing string lives as an { en, ar } pair. */
export type Localized<T = string> = Record<Locale, T>;

export type ProjectLink = {
  kind: "repo" | "live" | "doc";
  href: string;
};

export type ProjectMetric = {
  value: string;
  label: Localized;
};

export type ProjectArt = "seats" | "map" | "cloud" | "school" | "panels";

export type Project = {
  /** Used in the URL: /work/<slug> */
  slug: string;
  year: string;
  stack: string[];
  links: ProjectLink[];
  art: ProjectArt;
  title: Localized;
  category: Localized;
  tagline: Localized;
  summary: Localized;
  role: Localized;
  timeline: Localized;
  metrics: ProjectMetric[];
  challenge: Localized;
  features: Localized<string[]>;
  architecture: Localized<string[]>;
  outcomes: Localized<string[]>;
  keywords: Localized<string[]>;
};

export type Experience = {
  company: Localized;
  role: Localized;
  period: Localized;
  location: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  stack: string[];
};

export type SkillGroup = {
  key: string;
  icon: "code" | "server" | "database" | "sparkles" | "phone" | "map" | "compass";
  title: Localized;
  items: string[];
};

export type Certification = {
  title: Localized;
  issuer: Localized;
  year: string;
  summary: Localized;
};

export type EducationItem = {
  degree: Localized;
  school: Localized;
  period: Localized;
  summary: Localized;
};

export type LanguageSkill = {
  name: Localized;
  level: Localized;
  value: number;
};
