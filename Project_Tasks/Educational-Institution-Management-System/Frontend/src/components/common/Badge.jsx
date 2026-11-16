import { classNames } from "../../utils";

const tones = {
  neutral: "bg-border/70 text-ink/70",
  blue: "bg-brand-blue/12 text-brand-blue",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  error: "bg-error-50 text-error-700",
  info: "bg-info-50 text-info-700",
  amber: "bg-brand-amber/15 text-[#a06a1f]",
  lavender: "bg-brand-lavender/15 text-[#8b4fb8]",
  ink: "bg-ink/10 text-ink",
};

/** Small pill badge with semantic tones. */
const Badge = ({ children, tone = "neutral", dot = false, className = "" }) => (
  <span
    className={classNames(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
      tones[tone] || tones.neutral,
      className,
    )}
  >
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
    {children}
  </span>
);

export default Badge;
