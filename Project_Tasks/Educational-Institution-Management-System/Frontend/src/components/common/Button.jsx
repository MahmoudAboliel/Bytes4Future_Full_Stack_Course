import { classNames } from "../../utils";

const variants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "success",
];
const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "ui-button",
        `ui-button--${variants.includes(variant) ? variant : "primary"}`,
        `ui-button--${size}`,
        fullWidth && "ui-button--full",
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="ui-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
