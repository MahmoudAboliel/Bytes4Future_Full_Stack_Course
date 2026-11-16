import { classNames } from "../../utils";

/**
 * Standalone loading indicator.
 *   <Spinner />            inline
 *   <Spinner label="…" />  centered block with a label
 */
const Spinner = ({ label, size = "md", className = "" }) => {
  const sizeClass =
    size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-7 w-7" : "h-5 w-5";

  if (!label) {
    return (
      <span
        className={classNames("ui-spinner", sizeClass, className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={classNames(
        "flex flex-col items-center justify-center gap-3 py-14 text-muted",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className={classNames("ui-spinner", sizeClass)} aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
};

export default Spinner;
