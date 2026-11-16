import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "~/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

/** Card with a soft radial highlight that follows the pointer. */
export function SpotlightCard({ children, className, as = "div" }: SpotlightCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as "div";

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      onPointerMove={onPointerMove}
      className={cn(
        "spotlight relative overflow-hidden rounded-3xl border border-line bg-card transition-colors duration-300",
        "hover:border-line-strong",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
