import { createContext, useContext } from "react";

/**
 * Auth context + hook (kept apart from the provider component so that
 * fast-refresh only ever reloads components).
 */
export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;
