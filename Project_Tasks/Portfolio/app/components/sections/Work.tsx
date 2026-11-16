import { Link } from "react-router";
import { Icon } from "~/components/icons";
import { ProjectArt } from "~/components/ProjectArt";
import { Reveal } from "~/components/ui/Reveal";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { SpotlightCard } from "~/components/ui/SpotlightCard";
import { projects } from "~/data/projects";
import type { Project } from "~/data/types";
import { pathFor, useI18n } from "~/i18n";
import { cn } from "~/lib/utils";

export function Work() {
  const { locale, t } = useI18n();
  const projectPath = (slug: string) => pathFor(locale, `/work/${slug}`);

  return (
    <section id="work" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            kicker={t.home.selectedWork}
            title={t.home.selectedWorkTitle}
            lead={t.home.selectedWorkLead}
          />
        </Reveal>

        {/* Every project gets the same card — order follows app/data/projects.ts. */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2" aria-label={t.a11y.projectsList}>
          {projects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={(index % 2) * 90}>
              <ProjectCard project={project} href={projectPath(project.slug)} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project, href }: { project: Project; href: string }) {
  const { locale } = useI18n();

  return (
    <Link to={href} className="group block h-full">
      <SpotlightCard className="flex h-full flex-col overflow-hidden">
        <div className="relative aspect-[16/9] overflow-hidden">
          <ProjectArt
            variant={project.art}
            className={cn(
              "absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]",
            )}
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <span>{project.category[locale]}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="mt-2.5 text-[17px] font-bold leading-snug tracking-tight">
            {project.title[locale]}
          </h3>
          <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-muted">
            {project.tagline[locale]}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {project.stack.slice(0, 2).join(" · ")}
            </span>
            <span className="grid size-8 place-items-center rounded-full border border-line text-muted transition-colors duration-300 group-hover:border-accent/50 group-hover:text-accent">
              <Icon
                name="arrow-up-right"
                size={14}
                className="rtl:-scale-x-100"
              />
            </span>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
