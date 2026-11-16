export function getValueAtPath(source, path) {
  if (typeof path === "function") return path(source);
  if (Array.isArray(path)) path = path.join(".");
  if (typeof path !== "string" || !path) return undefined;
  if (source == null) return undefined;
  if (Object.prototype.hasOwnProperty.call(Object(source), path)) {
    return source[path];
  }

  return path.split(".").reduce((value, key) => value?.[key], source);
}
