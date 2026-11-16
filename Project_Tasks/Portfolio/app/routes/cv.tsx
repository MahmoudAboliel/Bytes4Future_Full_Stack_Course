import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";

import { Icon } from "~/components/icons";
import { certifications, education, experience, skills } from "~/data/resume";
import { getProject } from "~/data/projects";
import { profile } from "~/data/profile";
import { site } from "~/data/site";
import { getLocale, pathFor, ui } from "~/i18n";
import { seo } from "~/lib/seo";

export async function loader({ request }: LoaderFunctionArgs) {
  return { locale: getLocale(request) };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locale = data?.locale ?? "en";
  const t = ui[locale];

  return seo({
    title: t.meta.cvTitle,
    description: t.meta.cvDescription,
    path: pathFor(locale, "/cv"),
    locale,
    keywords:
      locale === "ar"
        ? ["السيرة الذاتية", "مطور Full-Stack", "محمود أبو الليل"]
        : ["CV", "resume", "Full-Stack developer", "Mahmoud Abulail"],
  });
};

const ink = "text-[#14141a]";
const soft = "text-[#4d4d5a]";
const faint = "text-[#6b6b74]";
const rule = "border-[#14141a]/12";

export default function CvRoute() {
  const { locale } = useLoaderData<typeof loader>();
  const t = ui[locale];
  const isAr = locale === "ar";
  const otherLocale = isAr ? "en" : "ar";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14 print-reset">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={pathFor(locale, "/")}
          className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[12px] font-medium text-muted transition-colors hover:bg-card hover:text-fg"
        >
          <Icon name="arrow-right" size={14} className="rtl:-scale-x-100" />
          {t.common.backHome}
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={site.cv[locale]}
            download
            className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[12px] font-semibold text-bg"
          >
            <Icon name="download" size={14} />
            {t.common.downloadCv}
          </a>
          <a
            href={site.cv[otherLocale]}
            download
            className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[12px] font-medium text-muted transition-colors hover:text-fg"
          >
            <Icon name="file" size={14} />
            {isAr ? "English PDF" : "نسخة عربية"}
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[16.1px] font-medium text-muted transition-colors hover:text-fg"
          >
            <Icon name="layers" size={14} />
            {t.common.print}
          </button>
        </div>
      </div>

      <p className="no-print mb-4 text-center text-[11px] text-muted">{t.cv.note}</p>

      <article
        dir={isAr ? "rtl" : "ltr"}
        lang={locale}
        className="cv-sheet print-reset mx-auto max-w-[840px] rounded-2xl bg-[#fdfdfb] px-6 py-8 sm:px-10 sm:py-11"
      >
        {/* Header */}
        <header className={`border-b ${rule} pb-3.5`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className={`font-display text-[34.8px] font-extrabold leading-tight tracking-tight sm:text-[42.9px] ${ink}`}>
                {profile.name[locale]}
              </h1>
              <p className={`mt-1.5 text-[17.4px] font-medium sm:text-[18.8px] ${soft}`}>
                {profile.role[locale]}
              </p>
            </div>
            <div className="flex min-w-0 items-start gap-4">
              <div className={`flex min-w-0 flex-col gap-1.5 text-[14.1px] print:gap-1 sm:text-[14.7px] ${soft}`}>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex min-w-0 items-start gap-1.5 py-1 [overflow-wrap:anywhere] print:py-0"
                >
                  <Icon name="mail" size={11} className="mt-[0.15em] shrink-0" /> {site.contact.email}
                </a>
                <a
                  href={`tel:${site.socials.Phone}`}
                  className="inline-flex min-w-0 items-start gap-1.5 py-1 print:py-0"
                >
                  <Icon name="phone" size={11} className="mt-[0.15em] shrink-0" /> {site.contact.phone}
                </a>
                <span className="inline-flex min-w-0 items-start gap-1.5">
                  <Icon name="map-pin" size={11} className="mt-[0.15em] shrink-0" />{" "}
                  {site.contact.location[locale]}
                </span>
                <span className="inline-flex min-w-0 items-start gap-1.5 [overflow-wrap:anywhere]">
                  <Icon name="github" size={11} className="mt-[0.15em] shrink-0" />{" "}
                  {site.socials.GitHub.replace("https://", "")}
                </span>
                <span className="inline-flex min-w-0 items-start gap-1.5 [overflow-wrap:anywhere]">
                  <Icon name="linkedin" size={11} className="mt-[0.15em] shrink-0" />{" "}
                  {site.socials.LinkedIn.replace("https://", "")}
                </span>
              </div>

              {/* JPEG on purpose: the PDF embeds this file directly. */}
              <img
                src={profile.photo.avatarJpeg}
                srcSet={`${profile.photo.avatarJpegSmall} 240w, ${profile.photo.avatarJpeg} 400w`}
                sizes="92px"
                width={400}
                height={400}
                alt={profile.photo.alt[locale]}
                className="size-[92px] shrink-0 rounded-full object-cover ring-1 ring-[#14141a]/15"
              />
            </div>
          </div>
        </header>

        {/* Summary */}
        <section className="mt-4">
          <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
            {t.cv.summary}
          </h2>
          <p className={`mt-1.5 text-[15.4px] leading-[1.7] ${soft}`}>
            {profile.summary[locale]}
          </p>
        </section>

        <div className="mt-5 grid gap-6 sm:grid-cols-[1.55fr_1fr]">
          <div className="flex flex-col gap-5">
            {/* Experience */}
            <section>
              <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
                {t.cv.experience}
              </h2>
              <div className="mt-2 flex flex-col gap-3">
                {experience.map((job) => (
                  <div key={job.company.en} className="print-break-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <h3 className={`min-w-0 text-[16.8px] font-bold leading-snug ${ink}`}>
                        {job.role[locale]}
                      </h3>
                      <span className={`shrink-0 text-[12.7px] ${faint}`}>{job.period[locale]}</span>
                    </div>
                    <p className={`text-[14.1px] ${faint}`}>
                      {job.company[locale]} · {job.location[locale]}
                    </p>
                    <ul className={`mt-1.5 flex flex-col gap-1 ${soft}`}>
                      {job.highlights[locale].map((item) => (
                        <li key={item} className="flex gap-1.5 text-[13.7px] leading-[1.55]">
                          <span className="mt-[0.45em] size-1 shrink-0 rounded-full bg-[#14141a]/35" />
                          <span className="min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
                {t.cv.projects}
              </h2>
              <div className="mt-2 flex flex-col gap-2">
                {["my-car", "go-bus", "education-management", "medical-gis"].map(
                  (slug) => {
                    const project = getProject(slug);
                    if (!project) return null;
                    return (
                      <div key={slug} className="print-break-avoid">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                          <h3 className={`min-w-0 text-[15.4px] font-bold ${ink}`}>
                            {project.title[locale]}
                          </h3>
                          <span className={`shrink-0 text-[12.7px] ${faint}`}>{project.year}</span>
                        </div>
                        <p className={`mt-0.5 text-[13.7px] leading-[1.55] ${soft}`}>
                          {project.tagline[locale]}
                        </p>
                        <p className={`mt-1 text-[12.1px] uppercase tracking-[0.06em] ${faint}`}>
                          {project.stack.join(" · ")}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            {/* Skills */}
            <section>
              <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
                {t.cv.skills}
              </h2>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {skills.map((group) => (
                  <div key={group.key}>
                    <p className={`text-[13.4px] font-semibold ${ink}`}>{group.title[locale]}</p>
                    <p className={`text-[13.1px] leading-[1.55] ${soft}`}>
                      {group.items.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
                {t.cv.education}
              </h2>
              {education.map((item) => (
                <div key={item.degree.en} className="mt-1.5">
                  <p className={`text-[14.5px] font-semibold leading-snug ${ink}`}>
                    {item.degree[locale]}
                  </p>
                  <p className={`text-[13.4px] ${faint}`}>
                    {item.school[locale]} · {item.period[locale]}
                  </p>
                </div>
              ))}
            </section>

            {/* Certifications */}
            <section>
              <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
                {t.cv.certifications}
              </h2>
              <div className="mt-1.5 flex flex-col gap-2">
                {certifications.map((cert) => (
                  <div key={cert.title.en}>
                    <p className={`text-[14.1px] font-semibold leading-snug ${ink}`}>
                      {cert.title[locale]} · {cert.year}
                    </p>
                    <p className={`text-[13.1px] leading-[1.5] ${soft}`}>{cert.summary[locale]}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className={`text-[13.4px] font-bold uppercase tracking-[0.2em] ${faint}`}>
                {t.cv.languages}
              </h2>
              <ul className={`mt-1.5 flex flex-col gap-1 text-[14.1px] ${soft}`}>
                {profile.languages.map((language) => (
                  <li key={language.name.en} className="flex justify-between gap-2">
                    <span>{language.name[locale]}</span>
                    <span className={faint}>{language.level[locale]}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <footer className={`mt-3 border-t ${rule} pt-2.5 text-[12.1px] ${faint}`}>
          {profile.nameLatin} · {site.contact.email} · {site.contact.phone} ·{" "}
          {isAr ? "ملف PDF مُولَّد من محتوى الموقع" : "PDF generated from this site's content"}
        </footer>
      </article>
    </div>
  );
}
