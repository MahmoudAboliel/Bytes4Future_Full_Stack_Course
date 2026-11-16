import { useSyncExternalStore } from "react";

// ─── Optional: thin wrapper to keep the old Provider API ─────────
import type { ReactNode } from "react";

export type Direction = "ltr" | "rtl";

// ─── Module-level state ──────────────────────────────────────────
let currentDirection: Direction = "ltr";
const listeners = new Set<() => void>();

export function setDirection(dir: Direction) {
  if (dir === currentDirection) return; // no-op → no re-render
  currentDirection = dir;
  listeners.forEach((l) => l());
}

export function getDirection(): Direction {
  return currentDirection;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ─── React hook ──────────────────────────────────────────────────
export function useDirection() {
  const dir = useSyncExternalStore(subscribe, getDirection, getDirection);
  return {
    dir,
    isRTL: dir === "rtl",
    flip: <T,>(ltr: T, rtl: T): T => (dir === "rtl" ? rtl : ltr),
  };
}

export function DirectionProvider({
  direction,
  children,
}: {
  direction: Direction;
  children: ReactNode;
}) {
  // Sync synchronously during render so children see the right value on mount
  if (getDirection() !== direction) setDirection(direction);

  return <>{children}</>;
}
