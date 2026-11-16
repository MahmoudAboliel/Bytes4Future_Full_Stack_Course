import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Icon } from "~/components/icons";
import { getLocale, pathFor, ui } from "~/i18n";
import { seo } from "~/lib/seo";

export async function loader({ request }: LoaderFunctionArgs) {
  return { locale: getLocale(request) };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locale = data?.locale ?? "en";
  const t = ui[locale];
  return [
    ...seo({
      title: `${t.meta.notFoundTitle} — ${ui[locale].meta.homeTitle.split("—")[0].trim()}`,
      description: t.meta.notFoundDescription,
      path: pathFor(locale, "/404"),
      locale,
    }),
    { name: "robots", content: "noindex, follow" },
  ];
};

export default function NotFound() {
  const { locale } = useLoaderData<typeof loader>();
  const t = ui[locale];
  const home = pathFor(locale, "/");

  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="aurora opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-grid fade-mask opacity-50" aria-hidden="true" />
      <div className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent">404</p>
        <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl">{t.notFound.title}</h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">{t.notFound.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to={home}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[13px] font-semibold text-bg"
          >
            <Icon name="arrow-right" size={15} className="rtl:-scale-x-100" />
            {t.notFound.cta}
          </Link>
          <a
            href={`${home}#work`}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[13px] font-medium text-fg-soft transition-colors hover:bg-card"
          >
            {t.common.backToWork}
          </a>
        </div>
      </div>
    </div>
  );
}
