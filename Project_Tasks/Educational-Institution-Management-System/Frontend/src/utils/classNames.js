export default function classNames(...values) {
  const names = [];

  const addValue = (value) => {
    if (!value) return;
    if (typeof value === "string" || typeof value === "number") {
      names.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(addValue);
      return;
    }
    if (typeof value === "object") {
      Object.entries(value).forEach(([name, enabled]) => {
        if (enabled) names.push(name);
      });
    }
  };

  values.forEach(addValue);
  return names.join(" ");
}
