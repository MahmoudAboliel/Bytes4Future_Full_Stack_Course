import { Icon, type IconName } from "~/components/icons";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { SpotlightCard } from "~/components/ui/SpotlightCard";
import { skills } from "~/data/resume";
import { useI18n } from "~/i18n";
import { pad } from "~/lib/utils";

/** Skills section — driven entirely by app/data/resume.ts */
export function Skills() {
  const { locale, t } = useI18n();

  return (
    <section id="skills" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            kicker={t.home.skillsKicker}
            title={t.home.skillsTitle}
            lead={t.home.skillsLead}
          />
        </Reveal>

        <ul
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label={t.a11y.skillList}
        >
          {skills.map((group, index) => (
            <Reveal as="li" key={group.key} delay={(index % 3) * 70}>
              <SpotlightCard className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-xl border border-line bg-accent/8 text-accent">
                    <Icon name={group.icon as IconName} size={18} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
                    {pad(index + 1)}
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
                  {group.title[locale]}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-line bg-bg/45 px-2 py-1 text-[11px] leading-none text-fg-soft"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
