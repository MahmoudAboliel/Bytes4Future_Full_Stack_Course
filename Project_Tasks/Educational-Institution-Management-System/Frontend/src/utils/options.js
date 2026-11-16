export function normalizeOptions(options = []) {
  return options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return { value: String(option), label: String(option) };
    }

    return {
      ...option,
      value: option.value ?? option.label ?? "",
      label: option.label ?? String(option.value ?? ""),
    };
  });
}

export function prependOption(options = [], placeholder) {
  return [placeholder, ...normalizeOptions(options)];
}
