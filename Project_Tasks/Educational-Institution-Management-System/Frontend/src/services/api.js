/**
 * Core API layer for EDUMS.
 *
 * The backend exposes **role-scoped** routers (Backend/app.js):
 *   /api/auth      -> login / register / current session
 *   /api/admin     -> admin only
 *   /api/secretary -> secretary only
 *   /api/teacher   -> teacher only
 *   /api/student   -> student only
 *
 * Every successful response uses the envelope:
 *   { success: true, data: <payload> }
 * and every failure uses:
 *   { message: "..." }
 *
 * List payloads come in two flavours depending on the endpoint:
 *   { data: [ ... ] }                     -> plain array
 *   { data: { items: [ ... ], meta } }    -> paginated collection
 *
 * `unwrapList` normalises both into a flat array so the UI layer never has
 * to care about the difference; `unwrapOne` returns a single record.
 */

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/+$/, "");

const TOKEN_KEY = "edums.token";
const USER_KEY = "edums.user";

/* -------------------------------------------------------------------------- */
/*                                    session                                   */
/* -------------------------------------------------------------------------- */

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) =>
  token
    ? localStorage.setItem(TOKEN_KEY, token)
    : localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Role of the signed-in user, or null when there is no session. */
export const getRole = () => getStoredUser()?.role ?? null;

/* -------------------------------------------------------------------------- */
/*                                   helpers                                    */
/* -------------------------------------------------------------------------- */

/** Mongoose documents use `_id`; normalize to `id` for the UI layer. */
const normalizeRecord = (record) => {
  if (record == null || typeof record !== "object") return record;
  if (Array.isArray(record)) return record.map(normalizeRecord);

  const { _id, ...rest } = record;
  const normalized = { ...rest };
  if (_id !== undefined && normalized.id === undefined) normalized.id = _id;

  // Recurse so nested documents are normalized too — notably the login
  // payload `{ token, user: { _id } }`, where `user.id` must exist for
  // every user-scoped page (cohorts by teacher, enrollments by student).
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];
    if (value && typeof value === "object") {
      normalized[key] = normalizeRecord(value);
    }
  });

  return normalized;
};

/** Pull `data` out of the response envelope. */
const payloadOf = (payload) => {
  if (payload == null) return payload;
  if (typeof payload === "object" && "data" in payload) return payload.data;
  return payload;
};

/**
 * Normalize a list payload into a flat array.
 * Handles both `{ data: [...] }` and `{ data: { items: [...] } }`.
 * Accepts a promise as well, so it can wrap an `api.get(...)` call directly.
 */
export const unwrapList = async (payload) => {
  const data = payloadOf(await payload);
  if (Array.isArray(data)) return data.map(normalizeRecord);
  if (Array.isArray(data?.items)) return data.items.map(normalizeRecord);
  return [];
};

/** Normalize a single-record payload. Accepts a promise as well. */
export const unwrapOne = async (payload) =>
  normalizeRecord(payloadOf(await payload));

/** Build a query string from a plain object (skips empty values). */
export const buildQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
      return;
    }
    search.append(key, value);
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

/* -------------------------------------------------------------------------- */
/*                                   request                                    */
/* -------------------------------------------------------------------------- */

async function request(path, { method = "GET", body, signal, query } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${BASE_URL}${path}${buildQuery(query)}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new Error("تعذّر الاتصال بالخادم، تحقّق من الشبكة.");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    // The session expired or the account was disabled -> drop the token so
    // the route guard sends the user back to the login screen.
    if (response.status === 401) setToken(null);
    throw new Error(
      (payload && payload.message) || `تعذّر تنفيذ الطلب (${response.status}).`,
    );
  }

  return payload;
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options = {}) =>
    request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options = {}) =>
    request(path, { ...options, method: "PATCH", body }),
  remove: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
};

/* -------------------------------------------------------------------------- */
/*                                     auth                                     */
/* -------------------------------------------------------------------------- */

export const authApi = {
  /** -> { token, user } */
  login: async (email, password) =>
    unwrapOne(await api.post("/auth/login", { email, password })),
  register: async (payload) =>
    unwrapOne(await api.post("/auth/register", payload)),
  /** -> the authenticated user */
  me: async () => unwrapOne(await api.get("/auth/me")),
};

/**
 * The backend caps every collection at 200 records per page, and the UI
 * performs its own search/filtering client-side — so we always ask for the
 * maximum page size.
 */
export const PAGE_SIZE = 200;

export default api;
