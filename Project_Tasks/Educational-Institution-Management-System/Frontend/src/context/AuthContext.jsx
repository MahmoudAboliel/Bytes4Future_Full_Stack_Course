import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./auth";
import { getToken, setToken } from "../services/api";

const USER_KEY = "edums.user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Session state for the real backend:
 * - login({ token, user }) from POST /api/auth/login
 * - the session is persisted in localStorage and restored on load
 * - logout() clears the session
 * - updateUser(patch) keeps the local profile in sync after the
 *   role-scoped profile update (PUT /api/student/me, /api/admin/users/:id …)
 */
export function AuthProvider({ children }) {
  // The session is restored from localStorage on the very first render, so
  // there is no effect that could flash a "logged out" state.
  const [user, setUser] = useState(() =>
    getToken() ? readStoredUser() : null,
  );

  const login = useCallback((session) => {
    if (session?.token) setToken(session.token);
    const raw = session?.user ?? session;
    // Defensive: guarantee an `id` even if the session arrived un-normalized.
    const profile =
      raw && typeof raw === "object" && raw._id && !raw.id
        ? { ...raw, id: raw._id }
        : raw;
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout, updateUser }),
    [user, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
