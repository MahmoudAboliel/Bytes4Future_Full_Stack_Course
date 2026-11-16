import { useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import {
  classNames,
  getFieldElementType,
  getInitialFormValues,
  validateFormValues,
} from "../../utils";

/**
 * Form with optional **sections**.
 *
 * A section groups related fields under a titled aside (icon + title +
 * description) and renders its fields in the grid. This keeps long forms
 * (student / teacher / cohort / session) readable instead of one long
 * undifferentiated wall of inputs.
 *
 *   <Form
 *     sections={[
 *       { title: "البيانات الأساسية", icon: User, fields: [...] },
 *       { title: "بيانات الدخول",  icon: Key,  fields: [...] },
 *     ]}
 *   />
 *
 * The legacy flat `fields` prop is still supported and renders as a single
 * unnamed section.
 */
const Form = ({
  sections,
  fields = [],
  initialValues = {},
  values: controlledValues,
  onValuesChange,
  onSubmit,
  submitLabel = "حفظ",
  cancelLabel = "إلغاء",
  onCancel,
  columns = 2,
  size = "md",
  compact = false,
  className = "",
  validate,
  requiredMessage,
  showErrorSummary = true,
  ...formProps
}) => {
  const [internalValues, setInternalValues] = useState(() =>
    getInitialFormValues(
      sections ? sections.flatMap((s) => s.fields || []) : fields,
      initialValues,
    ),
  );
  const values = controlledValues ?? internalValues;
  const isControlled = controlledValues !== undefined;
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  // Normalised shape: every section always has a fields array.
  const resolvedSections = useMemo(() => {
    if (sections?.length) {
      return sections.map((section) => ({
        ...section,
        fields: section.fields || [],
      }));
    }
    return fields.length ? [{ title: null, fields }] : [];
  }, [sections, fields]);

  const change = (name, value) => {
    const nextValues = { ...values, [name]: value };
    if (!isControlled) setInternalValues(nextValues);
    onValuesChange?.(nextValues);
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const errorList = useMemo(
    () =>
      Object.entries(errors).filter(([, message]) => Boolean(message)),
    [errors],
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validateFormValues(
      values,
      resolvedSections.flatMap((section) => section.fields),
      validate,
      requiredMessage,
    );
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      // Move focus to the first invalid field so the user is not hunting.
      const firstKey = Object.keys(nextErrors)[0];
      const node = formRef.current?.querySelector(`[name="${firstKey}"]`);
      node?.focus?.();
      node?.scrollIntoView?.({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setSubmitting(false);
    }
  }

  const renderField = (field) => {
    // Field-schema-only keys must not reach the DOM <input>.
    const {
      render,
      fullWidth,
      colSpan,
      validate: fieldValidate,
      requiredMessage: fieldRequiredMessage,
      ...inputField
    } = field;
    // `validate` / `requiredMessage` are consumed by validateFormValues().
    void fieldValidate;
    void fieldRequiredMessage;

    const spanClass =
      colSpan === 3
        ? "ui-form-field--full-3"
        : colSpan === 2 || fullWidth
          ? "ui-form-field--full"
          : "";

    return (
      <div key={field.name} className={spanClass}>
        {render ? (
          render({
            field,
            value: values[field.name] ?? "",
            error: errors[field.name],
            onChange: (value) => change(field.name, value),
          })
        ) : (
          <Input
            {...inputField}
            size={size}
            value={values[field.name] ?? ""}
            checked={
              field.type === "checkbox"
                ? Boolean(values[field.name])
                : undefined
            }
            onChange={(event) =>
              change(
                field.name,
                field.type === "checkbox"
                  ? event.target.checked
                  : event.target.value,
              )
            }
            error={errors[field.name]}
            as={getFieldElementType(field)}
            options={field.options || []}
          />
        )}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      className={classNames(
        "ui-form",
        `ui-form--columns-${columns}`,
        compact && "ui-form--compact",
        className,
      )}
      {...formProps}
      onSubmit={handleSubmit}
      noValidate
    >
      {showErrorSummary && submitted && errorList.length > 0 && (
        <div className="ui-form-alert mb-5" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            يوجد {errorList.length} حقل يحتاج تصحيحاً قبل الحفظ.
          </span>
        </div>
      )}

      {resolvedSections.map((section, sectionIndex) => (
        <div
          key={section.title || `section-${sectionIndex}`}
          className={classNames("ui-form-section", sectionIndex > 0 && "first:mt-0")}
        >
          {section.title && (
            <div className="ui-form-section-aside">
              <p className="ui-form-section-title">
                {section.icon && (
                  <span className="ui-form-section-icon">{section.icon}</span>
                )}
                {section.title}
              </p>
              {section.description && (
                <p className="ui-form-section-description">
                  {section.description}
                </p>
              )}
            </div>
          )}
          <div className="ui-form-section-body">
            <div className="ui-form-grid">
              {section.fields.map(renderField)}
            </div>
          </div>
        </div>
      ))}

      <div
        className={classNames(
          "ui-form-actions",
          onCancel === undefined && "ui-form-actions--inline",
        )}
      >
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default Form;
