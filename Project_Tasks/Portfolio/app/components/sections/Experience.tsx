import { Icon } from "~/components/icons";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { certifications, education, experience } from "~/data/resume";
import { profile } from "~/data/profile";
import { useI18n } from "~/i18n";

export function Experience() {
  const { locale, t } = useI18n();

  return (
    <section id="experience" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="04"
            kicker={t.home.experienceKicker}
            title={t.home.experienceTitle}
          />
        </Reveal>

        <ol className="mt-12 relative border-s border-line ps-6 sm:ps-9" aria-label={t.a11y.timeline}>
          {experience.map((job, index) => (
            <Reveal as="li" key={job.company.en} delay={index * 90} className="relative pb-12 last:pb-0">
              <span
                className="absolute -start-[1.6rem] top-1.5 grid size-3 place-items-center rounded-full border-2 border-bg bg-gradient-to-br from-accent to-accent-2 sm:-start-[2.4rem]"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{job.role[locale]}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-accent">
                    <Icon name="building" size={13} />
                    {job.company[locale]}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col text-[11.5px] text-muted sm:items-end">
                  <span className="font-mono uppercase tracking-[0.1em]">
                    {job.period[locale]}
                  </span>
                  <span>{job.location[locale]}</span>
                </div>
              </div>

              <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                {job.summary[locale]}
              </p>

              <ul className="mt-4 flex flex-col gap-2">
                {job.highlights[locale].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-fg-soft"
                  >
                    <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {job.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-line px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          <Reveal>
            <article className="glass h-full rounded-3xl p-6">
              <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon name="graduation" size={17} />
              </span>
              <h3 className="mt-4 text-[13.5px] font-semibold">{t.home.educationTitle}</h3>
              {education.map((item) => (
                <div key={item.degree.en} className="mt-3">
                  <p className="text-[13.5px] font-medium leading-snug">
                    {item.degree[locale]}
                  </p>
                  <p className="mt-1 text-[12px] text-muted">
                    {item.school[locale]} · {item.period[locale]}
                  </p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                    {item.summary[locale]}
                  </p>
                </div>
              ))}
            </article>
          </Reveal>

          <Reveal delay={80}>
            <article className="glass h-full rounded-3xl p-6">
              <span className="grid size-9 place-items-center rounded-xl bg-accent-2/10 text-accent-2">
                <Icon name="award" size={17} />
              </span>
              <h3 className="mt-4 text-[13.5px] font-semibold">
                {t.home.certificationsTitle}
              </h3>
              <ul className="mt-3 flex flex-col gap-4">
                {certifications.map((cert) => (
                  <li key={cert.title.en}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-[13px] font-medium leading-snug">
                        {cert.title[locale]}
                      </p>
                      <span className="shrink-0 font-mono text-[10px] text-muted">
                        {cert.year}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11.5px] text-muted">{cert.issuer[locale]}</p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted">
                      {cert.summary[locale]}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <Reveal delay={160}>
            <article className="glass h-full rounded-3xl p-6">
              <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon name="globe" size={17} />
              </span>
              <h3 className="mt-4 text-[13.5px] font-semibold">{t.home.languagesTitle}</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {profile.languages.map((language) => (
                  <li key={language.name.en} className="flex items-center justify-between gap-3">
                    <span className="text-[13px] text-fg-soft">{language.name[locale]}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {language.level[locale]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
                {locale === "ar"
                  ? "أكتب وثائق تقنية وأقدّم حلولاً بالعربية والإنكليزية، وأعمل مع فرق عن بُعد."
                  : "I document and present technical work in both languages, and collaborate with remote teams."}
              </p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
