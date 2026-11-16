import { Link } from "react-router";
import { Icon } from "~/components/icons";
import { SocialLinks } from "~/components/SocialLinks";
import { profile } from "~/data/profile";
import { site } from "~/data/site";
import { pathFor, useI18n } from "~/i18n";
import { formatDate } from "~/lib/utils";

export function Footer() {
  const { locale, t } = useI18n();
  const home = pathFor(locale, "/");
  const year = new Date().getFullYear();

  const nav = [
    { label: t.nav.work, href: `${home}#work` },
    { label: t.nav.about, href: `${home}#about` },
    { label: t.nav.skills, href: `${home}#skills` },
    { label: t.nav.experience, href: `${home}#experience` },
    { label: t.nav.contact, href: `${home}#contact` },
    { label: t.nav.cv, href: pathFor(locale, "/cv") },
  ];

  return (
    <footer className="relative mt-24 border-t border-line print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link to={home} className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-[0.7rem] bg-gradient-to-br from-accent to-accent-2 font-display text-[12.5px] font-extrabold text-white">
                MA
              </span>
              <span className="font-display text-base font-semibold tracking-tight">
                {profile.name[locale]}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {t.footer.tagline}
            </p>
            <SocialLinks className="mt-1" />
          </div>

          <nav aria-label={t.common.menu} className="flex flex-col gap-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
              {t.common.menu}
            </span>
            <ul className="flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-fg-soft transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
              {t.cv.contact}
            </span>
            <a
              href={`mailto:${site.contact.email}`}
              dir="ltr"
              className="text-sm text-fg-soft transition-colors hover:text-accent"
            >
              {site.contact.email}
            </a>
            <a
              href={`tel:${site.socials.Phone}`}
              dir="ltr"
              className="text-sm text-fg-soft transition-colors hover:text-accent"
            >
              {site.contact.phone}
            </a>
            <p className="text-sm text-muted">{site.contact.location[locale]}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-[11.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.nameLatin}. {t.footer.rights}
          </p>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em]">
            {t.footer.builtWith}
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-fg-soft transition-colors hover:text-accent"
          >
            <Icon name="arrow-up" size={13} />
            {t.footer.top}
          </a>
        </div>
        <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          {t.common.updated}: {formatDate(site.updatedAt, locale)}
        </p>
      </div>
    </footer>
  );
}
