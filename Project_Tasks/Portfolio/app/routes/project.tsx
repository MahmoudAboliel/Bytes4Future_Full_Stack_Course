import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";

import { Icon } from "~/components/icons";
import { ProjectArt } from "~/components/ProjectArt";
import { Reveal } from "~/components/ui/Reveal";
import { getProject, projects } from "~/data/projects";
import { profile } from "~/data/profile";
import { getLocale, pathFor, ui } from "~/i18n";
import { JsonLd } from "~/components/ui/JsonLd";
import { breadcrumbJsonLd, projectJsonLd, seo } from "~/lib/seo";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const locale = getLocale(request);
  const project = getProject(params.slug ?? "");

  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  return { locale, project };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Not found" }, { name: "robots", content: "noindex" }];
  }
  const { locale, project } = data;
  const t = ui[locale];

  return seo({
    title: `${project.title[locale]} — ${profile.nameLatin}`,
    description: project.summary[locale],
    path: pathFor(locale, `/work/${project.slug}`),
    locale,
    type: "article",
    keywords: [...project.stack, ...project.keywords[locale]],
  });
};

export default function ProjectRoute() {
  const { locale, project } = useLoaderData<typeof loader>();
  const t = ui[locale];

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  const path = pathFor(locale, `/work/${project.slug}`);
  const home = pathFor(locale, "/");

  const facts = [
    { label: t.common.role, value: project.role[locale] },
    { label: t.common.timeline, value: project.timeline[locale] },
    { label: t.common.year, value: project.year },
  ];

  return (
    <article>
      <JsonLd
        data={[
          projectJsonLd(project, locale),
          breadcrumbJsonLd([
            { name: t.common.home, path: home },
            { name: t.home.selectedWork, path: `${home}#work` },
            { name: project.title[locale], path },
          ]),
        ]}
      />

      <header className="relative overflow-hidden border-b border-line">
        <div
          className="absolute inset-0 -z-10 bg-grid opacity-50 fade-mask"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-8 sm:pt-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <Link to={home} className="transition-colors hover:text-fg">
              {t.common.home}
            </Link>
            <span aria-hidden="true">/</span>
            <a href={`${home}#work`} className="transition-colors hover:text-fg">
              {t.home.selectedWork}
            </a>
            <span aria-hidden="true">/</span>
            <span className="text-fg-soft">{project.title[locale]}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                <span className="rounded-full border border-line px-2.5 py-1">
                  {project.category[locale]}
                </span>
                <span>{project.year}</span>
              </div>
              <h1 className="mt-4 max-w-2xl text-[2.2rem] leading-[1.05] sm:text-[3.1rem]">
                {project.title[locale]}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
                {project.tagline[locale]}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {project.links.map((link) => (
                  <a
                    key={link.href + link.kind}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-[12px] font-medium text-fg-soft transition-colors hover:bg-card hover:text-fg"
                  >
                    <Icon
                      name={link.kind === "repo" ? "github" : link.kind === "live" ? "external" : "file"}
                      size={14}
                    />
                    {t.common[link.kind]}
                  </a>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-line">
              <ProjectArt variant={project.art} className="aspect-[16/10]" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div className="flex flex-col gap-12">
            <Reveal>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                {t.project.overview}
              </h2>
              <p className="mt-3 text-[15.5px] leading-[1.9] text-fg-soft">
                {project.summary[locale]}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                {t.project.challenge}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.9] text-fg-soft">
                {project.challenge[locale]}
              </p>
            </Reveal>

            <Reveal>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                {t.project.built}
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {project.features[locale].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 rounded-2xl border border-line bg-card p-3.5 text-[13px] leading-relaxed text-fg-soft"
                  >
                    <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                {t.project.architecture}
              </h2>
              <ol className="mt-4 flex flex-col gap-3">
                {project.architecture[locale].map((item, i) => (
                  <li key={item} className="flex items-start gap-3.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-[10px] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-fg-soft">{item}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal>
              <h2 className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                {t.project.outcomes}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {project.outcomes[locale].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-fg-soft">
                    <Icon name="arrow-right" size={14} className="mt-1 shrink-0 text-accent-2 rtl:-scale-x-100" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-line bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {t.project.facts}
              </p>
              <dl className="mt-4 flex flex-col divide-y divide-line">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                    <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      {fact.label}
                    </dt>
                    <dd className="text-[12.5px] font-medium leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-line bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {t.common.stack}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-line bg-bg/50 px-2 py-1 font-mono text-[10px] text-fg-soft"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-line bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                {t.project.keywords}
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {project.keywords[locale].map((keyword) => (
                  <li key={keyword} className="text-[12px] text-fg-soft">
                    #{keyword.replace(/\s+/g, "-")}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <Link
            to={pathFor(locale, `/work/${next.slug}`)}
            className="group flex items-center justify-between gap-6 rounded-3xl border border-line bg-card p-6 transition-colors hover:border-line-strong"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {t.common.nextProject}
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight">{next.title[locale]}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-accent transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              <Icon name="arrow-right" size={18} className="rtl:-scale-x-100" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
