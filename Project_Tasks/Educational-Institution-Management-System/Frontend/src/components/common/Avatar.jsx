import { avatarColor, classNames, initials } from "../../utils";

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

/** Circular initials avatar (color derived from the record id). */
const Avatar = ({ name = "", color, seed, size = "md", className = "" }) => (
  <span
    className={classNames(
      "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white",
      sizeMap[size] || sizeMap.md,
      className,
    )}
    style={{ backgroundColor: color || avatarColor(seed || name) }}
    aria-hidden="true"
  >
    {initials(name) || "؟"}
  </span>
);

export default Avatar;
