export const toneMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    ring: "ring-indigo-500/20",
    bar: "from-indigo-500 to-indigo-400",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    ring: "ring-red-500/20",
    bar: "from-red-500 to-red-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-500/20",
    bar: "from-emerald-500 to-emerald-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    ring: "ring-amber-500/20",
    bar: "from-amber-500 to-amber-400",
  },
};

export const icons = {
  box: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  alert:
    "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  arrowDown: "M12 5v14 M19 12l-7 7-7-7",
  arrowUp: "M12 19V5 M5 12l7-7 7 7",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
};

export const daysAgo = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const COLORS = {
  in: "#10b981",
  out: "#ef4444",
  accent: "#6366f1",
  amber: "#f59e0b",
};

export const PIE_COLORS = [COLORS.in, COLORS.out];

export const nf = new Intl.NumberFormat("en-US");

export const toDate = (d: string | Date) =>
  d instanceof Date ? d : new Date(d);

export const dayKey = (d: string | Date) => {
  const date = toDate(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

export const formatDate = (d: string | Date) =>
  toDate(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatTime = (d: string | Date) =>
  toDate(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
