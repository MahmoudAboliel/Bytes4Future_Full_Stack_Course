import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

/** Inline, blocking script: resolves the theme before the first paint. */
export const THEME_SCRIPT = `(function(){try{
  var stored = localStorage.getItem("theme");
  var system = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var dark = stored ? stored === "dark" : system;
  var root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  root.setAttribute("data-anim", "on");
}catch(e){
  document.documentElement.setAttribute("data-anim", "on");
}})();`;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const current = root.classList.contains("dark") ? "dark" : "light";
    setTheme(current);
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      const next = event.matches ? "dark" : "light";
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
    };

    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — the theme still applies for this session */
    }
    setTheme(next);
  }, []);

  return { theme, mounted, toggle };
}
