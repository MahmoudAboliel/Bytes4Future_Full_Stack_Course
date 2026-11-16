import { useEffect } from "react";
import { X } from "lucide-react";
import { classNames, getNotificationPresentation } from "../../utils";

const ToastNotification = ({
  open = true,
  type = "success",
  title,
  message,
  onClose,
  duration = 4000,
  icon,
  dismissLabel = "Dismiss notification",
  className = "",
  ...props
}) => {
  useEffect(() => {
    if (!open || !duration || !onClose) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;
  const presentation = getNotificationPresentation(type);
  return (
    <div
      className={classNames("ui-toast", `ui-toast--${type}`, className)}
      role={presentation.role}
      {...props}
    >
      <span
        className={classNames("ui-toast-mark", `ui-toast-mark-${type}`)}
        aria-hidden="true"
      >
        {icon ?? presentation.icon}
      </span>
      <div className="ui-toast-copy">
        <strong>{title || presentation.label}</strong>
        {message && <p>{message}</p>}
      </div>
      {onClose && (
        <button
          className="ui-icon-button -me-1 -mt-1"
          type="button"
          aria-label={dismissLabel}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ToastNotification;
