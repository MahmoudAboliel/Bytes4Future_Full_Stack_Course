import { Icon } from "~/components/icons";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { SpotlightCard } from "~/components/ui/SpotlightCard";
import { profile } from "~/data/profile";
import { education } from "~/data/resume";
import { site } from "~/data/site";
import { useI18n } from "~/i18n";

const serviceIcons = ["code", "server", "smartphone"] as const;

export function About() {
  const { locale, t } = useI18n();
  const degree = education[0];

  return (
    <section id="about" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            kicker={t.home.aboutKicker}
            title={t.home.aboutTitle}
            lead={t.home.aboutLead}
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
          <div className="flex flex-col gap-8">
            <Reveal>
              <p className="text-[15.5px] leading-[1.9] text-fg-soft sm:text-[16.5px]">
                {profile.about[locale]}
              </p>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-3">
              {profile.services.map((service, index) => (
                <Reveal key={service.title.en} delay={index * 80}>
                  <SpotlightCard className="h-full p-5">
                    <span className="mb-4 grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon name={serviceIcons[index]} size={17} />
                    </span>
                    <h3 className="text-[14.5px] font-semibold tracking-tight">
                      {service.title[locale]}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                      {service.body[locale]}
                    </p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <aside className="glass overflow-hidden rounded-3xl">
              <div className="border-b border-line px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {t.home.statsTitle}
                </p>
              </div>

              <dl className="divide-y divide-line">
                <div className="px-5 py-4">
                  <dt className="flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted">
                    <Icon name="map-pin" size={16} className="text-accent" />
                    {t.common.location}
                  </dt>
                  <dd className="mt-1 ps-7 text-[13.5px] font-medium">
                    {site.contact.location[locale]}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted">
                    <Icon name="graduation" size={16} className="text-accent" />
                    {t.cv.education}
                  </dt>
                  <dd className="mt-1 ps-7 text-[13.5px] font-medium">
                    {degree.degree[locale]}
                  </dd>
                  <dd className="mt-0.5 ps-7 text-[12px] text-muted">
                    {degree.school[locale]} · {degree.period[locale]}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-muted">
                    <Icon name="layers" size={16} className="text-accent" />
                    {locale === "ar" ? "التركيز" : "Focus"}
                  </dt>
                  <dd className="mt-1 ps-7 text-[13.5px] font-medium">
                    React · Node.js · React Native
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                    <Icon name="globe" size={14} className="text-accent" />
                    {t.common.languages}
                  </dt>
                  <dd className="mt-3 flex flex-col gap-3">
                    {profile.languages.map((language) => (
                      <div key={language.name.en}>
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="font-medium">{language.name[locale]}</span>
                          <span className="text-muted">{language.level[locale]}</span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                            style={{ width: `${language.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </dd>
                </div>
              </dl>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
