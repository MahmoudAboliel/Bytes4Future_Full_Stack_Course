import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { classNames, normalizeOptions } from "../../utils";

/**
 * Text field.
 *
 *   <Input label="البريد" type="email" required error="…" hint="…" />
 *
 * `as` selects the element (input | textarea | select). `icon` renders a
 * leading glyph, `suffix` a trailing one.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    error,
    hint,
    description,
    prefix,
    suffix,
    icon,
    className = "",
    wrapperClassName = "",
    as = "input",
    options = [],
    size = "md",
    rows = 4,
    required = false,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || name || generatedId;
  const { "aria-describedby": externalDescribedBy, ...inputProps } = props;

  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  const describedBy =
    [
      externalDescribedBy,
      error ? errorId : null,
      !error && description ? descriptionId : null,
      !error && !description && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const common = {
    id: fieldId,
    name,
    required: required || undefined,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": describedBy,
    className: classNames(
      "ui-input",
      `ui-input--${size}`,
      error && "ui-input--error",
      className,
    ),
    ref,
    ...inputProps,
  };

  const hasAffix = Boolean(prefix || suffix || icon);
  // A single leading slot: an explicit `icon` wins over a `prefix` glyph.
  const leading = icon || prefix;

  return (
    <div className={classNames("ui-field", wrapperClassName)}>
      {label && (
        <label className="ui-label" htmlFor={fieldId}>
          {label}
          {required && (
            <span className="ui-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <p id={descriptionId} className="mb-1.5 text-xs leading-relaxed text-muted">
          {description}
        </p>
      )}

      <div
        className={classNames(
          "ui-input-wrap",
          hasAffix && "ui-input-wrap--affix",
        )}
      >
        {leading && <span className="ui-input-affix">{leading}</span>}

        {as === "select" ? (
          <select {...common}>
            {normalizeOptions(options).map((option, index) => (
              <option
                key={option.value ?? `${option.label}-${index}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        ) : as === "textarea" ? (
          <textarea {...common} rows={rows} />
        ) : (
          <input {...common} />
        )}

        {suffix && <span className="ui-input-affix">{suffix}</span>}
      </div>

      {error ? (
        <p id={errorId} className="ui-field-error">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="ui-field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
