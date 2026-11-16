import { Link } from "react-router";
import { Icon } from "~/components/icons";
import { profile } from "~/data/profile";
import { site } from "~/data/site";
import { pathFor, useI18n } from "~/i18n";

const marqueeItems = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "React Native",
  "Expo",
  "MongoDB",
  "PostgreSQL",
  "PostGIS",
  "Tailwind CSS",
  "Socket.IO",
  "Python",
  "REST APIs",
  "Prisma",
];

export function Hero() {
  const { locale, t } = useI18n();
  const home = pathFor(locale, "/");
  const cv = pathFor(locale, "/cv");
  const words = profile.name[locale].split(" ");
  const first = locale === "en" ? words[0] : words[0];
  const rest = locale === "en" ? words.slice(1) : words.slice(1);

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20"
    >
      <div className="aurora" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-grid fade-mask opacity-70"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-line bg-card/70 py-1.5 pe-3.5 ps-2.5 text-[11.5px] font-medium backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-fg-soft">{profile.availability[locale]}</span>
          </div>

          <h1 className="mt-7 text-[clamp(2.85rem,8.4vw,5rem)] leading-[0.95] tracking-[-0.045em]">
            <span className="block">{first}</span>
            <span className="block text-gradient">{rest.join(" ")}</span>
          </h1>

          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-fg-soft sm:text-base">
            <span>{profile.role[locale]}</span>
            <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden="true" />
            <span className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted">
              {profile.roleAlt[locale]}
            </span>
          </p>

          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted sm:text-[17px]">
            {profile.tagline[locale]}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`${home}#work`}
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-[13.5px] font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t.home.selectedWork}
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
              />
            </a>
            <Link
              to={cv}
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-[13.5px] font-semibold text-fg transition-colors duration-200 hover:bg-card"
            >
              <Icon name="download" size={16} className="text-accent" />
              {t.common.downloadCv}
            </Link>
            <a
              href={site.socials.GitHub}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Icon name="github" size={17} />
            </a>
            <a
              href={site.socials.LinkedIn}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <Icon name="linkedin" size={17} />
            </a>
          </div>

          <dl className="mt-10 grid w-full max-w-lg grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.value} className="border-t border-line pt-3">
                <dt className="sr-only">{stat.label[locale]}</dt>
                <dd>
                  <span className="block font-display text-lg font-bold tracking-tight">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">
                    {stat.label[locale]}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait card */}
        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
          <div
            className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent/25 via-transparent to-accent-2/25 blur-2xl"
            aria-hidden="true"
          />
          <figure className="glass relative overflow-hidden rounded-[1.6rem] p-1.5">
            <div className="relative overflow-hidden rounded-[1.25rem] bg-bg-elev">
              <picture className="block">
                <source
                  type="image/webp"
                  media="screen"
                  srcSet={`${profile.photo.heroSmall} 640w, ${profile.photo.hero} 1000w`}
                  sizes="(min-width: 1024px) 520px, (min-width: 640px) 480px, 92vw"
                />
                <img
                  src={profile.photo.heroJpeg}
                  srcSet={`${profile.photo.heroJpegSmall} 640w, ${profile.photo.heroJpeg} 1000w`}
                  sizes="(min-width: 1024px) 520px, (min-width: 640px) 480px, 92vw"
                  width={profile.photo.heroWidth}
                  height={profile.photo.heroHeight}
                  alt={profile.photo.alt[locale]}
                  fetchPriority="high"
                  className="aspect-[3/2] w-full object-cover"
                />
              </picture>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5 p-4">
                <div className="min-w-0">
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/65">
                    {locale === "ar" ? "المطوّر" : "The developer"}
                  </p>
                  <p className="mt-1 text-[13.5px] font-semibold leading-snug text-white">
                    {profile.role[locale]}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-2.5 py-1 text-[10.5px] font-medium text-white backdrop-blur-md">
                  <Icon name="map-pin" size={11} className="text-white/80" />
                  {site.contact.location[locale]}
                </span>
              </figcaption>
            </div>
          </figure>

          {/* <div className="glass absolute -bottom-5 end-4 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 sm:flex">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
              <Icon name="smartphone" size={15} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
                {locale === "ar" ? "خبرة الجوال" : "Mobile stack"}
              </p>
              <p className="truncate text-[12px] font-semibold">React Native · Expo</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Tech marquee */}
      <div className="marquee relative mt-14 overflow-hidden border-y border-line py-3.5 sm:mt-20">
        <div className="edge-fade edge-fade-start" />
        <div className="edge-fade edge-fade-end" />
        <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {marqueeItems.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
                >
                  {item}
                  <span className="size-1 rounded-full bg-line-strong" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
