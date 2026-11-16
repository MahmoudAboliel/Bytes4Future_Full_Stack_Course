import { classNames } from "../../utils";

/**
 * Brand logo (SVG mark + wordmark).
 *   <Logo />              full (dark text)
 *   <Logo onLight />      for dark surfaces (sidebar / login panel)
 *   <Logo variant="compact" />  mark only
 */
const Logo = ({ variant = "full", className = "", onLight = false }) => {
  const mark = (
    <img
      src="/EduMS%20Learning%20Logo%20(1).png"
      alt={variant === "compact" ? "EDUMS" : ""}
      aria-hidden={variant !== "compact"}
      className="h-11 w-11 shrink-0 rounded-xl bg-white object-contain p-0.5"
    />
  );

  if (variant === "compact") return <span className={className}>{mark}</span>;

  return (
    <span className={classNames("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span
        className={classNames(
          "font-kufi text-lg font-bold leading-none",
          onLight ? "text-white" : "text-ink",
        )}
      >
        إديو<span className="text-brand-blue">مس</span>
      </span>
    </span>
  );
};

export default Logo;
