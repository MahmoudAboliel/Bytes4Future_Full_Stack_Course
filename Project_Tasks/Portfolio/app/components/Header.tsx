import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { Icon } from "~/components/icons";
import { SocialLinks } from "~/components/SocialLinks";
import { site } from "~/data/site";
import { profile } from "~/data/profile";
import { alternatePath, pathFor, useI18n } from "~/i18n";
import { cn } from "~/lib/utils";
import { useTheme } from "~/lib/theme";

const navKeys = ["work", "about", "skills", "experience", "contact"] as const;

export function Header() {
  const { locale, t } = useI18n();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 8);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const home = pathFor(locale, "/");

  const links = useMemo(
    () =>
      navKeys.map((key) => ({
        key,
        label: t.nav[key],
        href: `${home}#${key}`,
      })),
    [home, t],
  );

  const cvPath = pathFor(locale, "/cv");
  const isCv = location.pathname === "/cv" || location.pathname === "/ar/cv";

  return (
    <header className="sticky top-0 z-50 print:hidden">
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "border-b border-line bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/65"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 sm:h-[4.5rem] sm:px-8">
          <Link
            to={home}
            className="group flex items-center gap-2.5 rounded-full"
          >
            <span className="relative grid size-9 place-items-center overflow-hidden rounded-[0.7rem] bg-gradient-to-br from-accent to-accent-2 font-display text-[12.5px] font-extrabold tracking-tight text-white shadow-[0_8px_20px_-10px_var(--glow)]">
              MA
              <span className="absolute inset-0 rounded-[0.7rem] ring-1 ring-inset ring-white/25" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[13.5px] font-semibold tracking-tight">
                {profile.nameLatin}
              </span>
              <span className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted">
                {locale === "ar" ? "مطوّر Full-Stack" : "Full-Stack Dev"}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-line/60 bg-card/60 p-1 backdrop-blur-md lg:flex">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:bg-bg-elev hover:text-fg"
              >
                {link.label}
              </a>
            ))}
            <Link
              to={cvPath}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 hover:bg-bg-elev hover:text-fg",
                isCv ? "bg-bg-elev text-fg" : "text-muted",
              )}
              aria-current={isCv ? "page" : undefined}
            >
              {t.nav.cv}
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <LocaleToggle />
            <ThemeToggle />
            <Link
              to={cvPath}
              className="hidden items-center gap-2 rounded-full bg-fg px-4 py-2 text-[12.5px] font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex"
            >
              <Icon name="download" size={15} />
              {t.common.downloadCv}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.common.close : t.common.menu}
              className="grid size-9 place-items-center rounded-full border border-line text-fg transition hover:bg-card lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={18} />
            </button>
          </div>
        </div>
        <div
          className="h-px w-full origin-left bg-gradient-to-r from-accent via-accent-2 to-transparent transition-transform duration-150 ease-out"
          style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        />
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[4rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-bg/95 px-5 pb-10 pt-6 backdrop-blur-2xl sm:top-[4.5rem] lg:hidden"
      >
        <nav className="flex flex-col">
          {[...links, { key: "cv" as const, label: t.nav.cv, href: cvPath }].map(
            (link, index) => (
              <a
                key={link.key}
                href={link.href}
                className="flex items-center justify-between border-b border-line py-4 text-xl font-semibold tracking-tight transition-colors hover:text-accent"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {link.label}
                <Icon name="arrow-up-right" size={18} className="text-muted" />
              </a>
            ),
          )}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <Icon name="globe" size={15} />
            {t.common.language}
          </div>
          <LocaleToggle variant="full" />
        </div>

        <div className="mt-6">
          <SocialLinks />
        </div>

        <a
          href={site.cv[locale]}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-fg px-5 py-3.5 text-sm font-semibold text-bg"
        >
          <Icon name="download" size={16} />
          {t.common.downloadCv}
        </a>
      </div>
    </header>
  );
}

export function LocaleToggle({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const { locale, t } = useI18n();
  const location = useLocation();

  const target = (next: "en" | "ar") =>
    alternatePath(
      location.pathname,
      location.search,
      location.hash,
      next,
    );

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-line bg-card/60 p-0.5 font-mono text-[11px] font-medium uppercase",
        variant === "compact" && "hidden sm:flex",
      )}
      role="group"
      aria-label={t.common.language}
    >
      <Link
        to={target("en")}
        hrefLang="en"
        aria-current={locale === "en" ? "page" : undefined}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en" ? "bg-fg text-bg" : "text-muted hover:text-fg",
        )}
      >
        EN
      </Link>
      <Link
        to={target("ar")}
        hrefLang="ar"
        aria-current={locale === "ar" ? "page" : undefined}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "ar" ? "bg-fg text-bg" : "text-muted hover:text-fg",
        )}
      >
        ع
      </Link>
    </div>
  );
}

export function ThemeToggle() {
  const { t } = useI18n();
  const { theme, mounted, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.common.theme}
      title={theme === "dark" ? t.common.themeLight : t.common.themeDark}
      className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-line text-fg transition hover:bg-card"
    >
      <Icon
        name="sun"
        size={17}
        className={cn(
          "absolute transition-all duration-500",
          mounted && theme === "dark"
            ? "rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Icon
        name="moon"
        size={17}
        className={cn(
          "absolute transition-all duration-500",
          mounted && theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0",
        )}
      />
    </button>
  );
}
