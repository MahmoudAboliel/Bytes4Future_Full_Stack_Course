import { createContext, useContext } from "react";

/**
 * Toast context + hook (kept apart from the provider component so that
 * fast-refresh only ever reloads components).
 */
export const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export default ToastContext;
