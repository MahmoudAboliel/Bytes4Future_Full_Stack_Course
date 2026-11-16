export function getInitialFormValues(fields = [], initialValues = {}) {
  const defaults = Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.defaultValue ?? (field.type === "checkbox" ? false : ""),
    ]),
  );

  return { ...defaults, ...initialValues };
}

export function getFieldElementType(field = {}) {
  return (
    field.as ||
    (field.options
      ? "select"
      : field.type === "textarea"
        ? "textarea"
        : "input")
  );
}

export function validateFormValues(
  values,
  fields = [],
  validate,
  requiredMessage = "هذا الحقل مطلوب",
) {
  const errors = {};

  fields.forEach((field) => {
    const value = values[field.name];
    const isEmpty =
      value == null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0) ||
      (field.type === "checkbox" && value !== true);

    if (field.required && isEmpty) {
      errors[field.name] = field.requiredMessage || requiredMessage;
      return;
    }

    if (typeof field.validate === "function") {
      const error = field.validate(value, values);
      if (error) errors[field.name] = error;
    }
  });

  return { ...errors, ...(validate?.(values) || {}) };
}
