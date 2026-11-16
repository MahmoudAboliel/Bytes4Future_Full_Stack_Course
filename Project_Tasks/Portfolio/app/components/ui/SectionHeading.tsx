import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type SectionHeadingProps = {
  index: string;
  kicker: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  children?: ReactNode;
};

export function SectionHeading({
  index,
  kicker,
  title,
  lead,
  align = "start",
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
      )}
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <span>{kicker}</span>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
        <h2 className="max-w-2xl text-3xl leading-[1.1] sm:text-4xl lg:text-[2.9rem]">
          {title}
        </h2>
        {children}
      </div>
      {lead ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted sm:text-[17px]",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
