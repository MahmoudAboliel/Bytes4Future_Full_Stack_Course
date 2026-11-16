import { site } from "~/data/site";
import { Icon } from "~/components/icons";
import { cn } from "~/lib/utils";
import { useI18n } from "~/i18n";

const links = [
  {
    label: "GitHub",
    href: site.socials.GitHub,
    icon: "github" as const,
  },
  {
    label: "LinkedIn",
    href: site.socials.LinkedIn,
    icon: "linkedin" as const,
  },
  {
    label: "Email",
    href: `mailto:${site.contact.email}`,
    icon: "mail" as const,
  },
  {
    label: "Phone",
    href: `tel:${site.socials.Phone}`,
    icon: "phone" as const,
  },
];

export function SocialLinks({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <li key={link.label}>
            <a
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer noopener" : undefined}
              title={link.label}
              className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:bg-card hover:text-fg"
            >
              <Icon name={link.icon} size={17} />
              <span className="sr-only">
                {link.label} {external ? `(${t.common.external})` : ""}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
