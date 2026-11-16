import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "~/components/icons";
import { SocialLinks } from "~/components/SocialLinks";
import { Reveal } from "~/components/ui/Reveal";
import { site } from "~/data/site";
import { useI18n, pathFor } from "~/i18n";

export function Contact() {
  const { locale, t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-28 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-card px-6 py-10 sm:px-10 sm:py-14">
            <div
              className="absolute inset-0 -z-10 bg-grid opacity-40 fade-mask"
              aria-hidden="true"
            />
            <div
              className="absolute -top-32 start-1/3 -z-10 size-[420px] rounded-full bg-accent/15 blur-[90px]"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              <span className="text-accent">05</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
              <span>{t.home.contactKicker}</span>
            </div>

            <div className="mt-5 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h2 className="max-w-xl text-[2rem] leading-[1.1] sm:text-[2.7rem]">
                  {t.home.contactTitle}
                </h2>
                <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-muted">
                  {t.home.contactLead}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-[13px] font-semibold text-bg transition-transform hover:-translate-y-0.5"
                  >
                    <Icon name="mail" size={15} />
                    {t.home.contactEmailCta}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-3 text-[12.5px] font-medium text-fg-soft transition-colors hover:bg-bg-elev hover:text-fg"
                  >
                    <Icon
                      name={copied ? "check" : "copy"}
                      size={14}
                      className={copied ? "text-emerald-500" : "text-accent"}
                    />
                    {copied ? t.common.copied : t.common.copy}
                  </button>
                  <Link
                    to={pathFor(locale, "/cv")}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-3 text-[12.5px] font-medium text-muted transition-colors hover:text-fg"
                  >
                    <Icon name="file" size={14} />
                    {t.common.viewCv}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <a
                  href={`mailto:${site.contact.email}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-bg/50 p-3.5 transition-colors hover:border-line-strong"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon name="mail" size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">
                      {t.common.email}
                    </span>
                    <span dir="ltr" className="block truncate text-[13px] font-medium">
                      {site.contact.email}
                    </span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={14}
                    className="ms-auto shrink-0 text-muted transition-colors group-hover:text-accent rtl:-scale-x-100"
                  />
                </a>

                <a
                  href={`tel:${site.socials.Phone}`}
                  className="group flex items-center gap-3 rounded-2xl border border-line bg-bg/50 p-3.5 transition-colors hover:border-line-strong"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-2/10 text-accent-2">
                    <Icon name="phone" size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">
                      {t.common.phone}
                    </span>
                    <span dir="ltr" className="block text-[13px] font-medium">
                      {site.contact.phone}
                    </span>
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={14}
                    className="ms-auto shrink-0 text-muted transition-colors group-hover:text-accent rtl:-scale-x-100"
                  />
                </a>

                <div className="flex items-center justify-between rounded-2xl border border-line bg-bg/50 p-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon name="map-pin" size={16} />
                    </span>
                    <span>
                      <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">
                        {t.common.location}
                      </span>
                      <span className="block text-[13px] font-medium">
                        {site.contact.location[locale]}
                      </span>
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    {site.contact.timezone}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {locale === "ar" ? "أو عبر" : "Or find me on"}
                  </span>
                  <SocialLinks />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
