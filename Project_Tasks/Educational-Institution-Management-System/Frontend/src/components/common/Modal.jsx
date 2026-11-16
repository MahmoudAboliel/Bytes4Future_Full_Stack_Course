import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { classNames } from "../../utils";

/**
 * Dialog. Sizes: xs | sm | md | lg | xl | 2xl.
 * On small screens it behaves as a bottom sheet; from `sm` up it is a
 * centered dialog.
 */
const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  closeLabel = "إغلاق",
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  ...props
}) => {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;

  useEffect(() => {
    if (!open) return;
    const onKey = (event) =>
      closeOnEscape && event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  return (
    <div
      className="ui-modal-backdrop"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
      }}
    >
      <section
        className={classNames("ui-modal", `ui-modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        <header className={classNames("ui-modal-header", headerClassName)}>
          <div className="min-w-0">
            {title && <h2 id={titleId}>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          <button
            type="button"
            className="ui-icon-button -me-1.5 -mt-1 shrink-0"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className={classNames("ui-modal-content", contentClassName)}>
          {children}
        </div>

        {footer && (
          <footer className={classNames("ui-modal-footer", footerClassName)}>
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
};

export default Modal;
