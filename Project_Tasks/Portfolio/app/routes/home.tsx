import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";

import { About } from "~/components/sections/About";
import { Contact } from "~/components/sections/Contact";
import { Experience } from "~/components/sections/Experience";
import { Hero } from "~/components/sections/Hero";
import { Skills } from "~/components/sections/Skills";
import { Work } from "~/components/sections/Work";
import { JsonLd } from "~/components/ui/JsonLd";
import { projects } from "~/data/projects";
import { profile } from "~/data/profile";
import { getLocale, pathFor, ui } from "~/i18n";
import { personJsonLd, profilePageJsonLd, seo } from "~/lib/seo";

export async function loader({ request }: LoaderFunctionArgs) {
  return { locale: getLocale(request) };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const locale = data?.locale ?? "en";
  const t = ui[locale];

  return seo({
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
    path: pathFor(locale, "/"),
    locale,
    type: "profile",
    keywords: [
      ...(locale === "ar"
        ? ["مطور ويب", "مطور Full-Stack", "React", "Node.js", "دمشق", "سوريا"]
        : ["full-stack developer", "React developer", "Node.js", "Damascus", "Syria"]),
      ...projects.flatMap((project) => project.keywords[locale]),
    ],
  });
};

export default function Home() {
  const { locale } = useLoaderData<typeof loader>();

  return (
    <>
      <JsonLd data={[personJsonLd(locale), profilePageJsonLd(locale)]} />
      <Hero />
      <About />
      <Work />
      <Skills />
      <Experience />
      <Contact />
      <p className="sr-only">
        {profile.name[locale]} — {profile.role[locale]}
      </p>
    </>
  );
}
