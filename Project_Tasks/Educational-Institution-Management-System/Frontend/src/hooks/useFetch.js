import { useCallback, useEffect, useReducer, useRef } from "react";

const EMPTY = Object.freeze([]);

const initialState = { data: null, loading: true, error: "" };

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return { ...state, loading: true, error: "" };
    case "success":
      return { data: action.data, loading: false, error: "" };
    case "failure":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

/**
 * Generic data-fetching hook.
 *
 *   const { data, loading, error, reload } = useFetch(() => adminApi.users.list(), []);
 *
 * - `data` defaults to a stable empty array so list rendering and effects
 *   never need null checks (and never re-trigger on reference changes).
 * - `reload()` refetches after mutations (create/update/delete).
 * - The fetcher is read through a ref, so inline functions are safe.
 */
export default function useFetch(fetcher, deps = []) {
  const fetcherRef = useRef(fetcher);
  const requestIdRef = useRef(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [version, bumpVersion] = useReducer((n) => n + 1, 0);

  // Keep the latest fetcher without re-running the effect.
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const reload = useCallback(() => bumpVersion(), []);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    dispatch({ type: "start" });

    Promise.resolve()
      .then(() => fetcherRef.current(controller.signal))
      .then((result) => {
        // Ignore responses from superseded requests.
        if (requestId !== requestIdRef.current) return;
        dispatch({ type: "success", data: result });
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        if (err?.name === "AbortError") return;
        dispatch({
          type: "failure",
          error: err?.message || "حدث خطأ غير متوقع.",
        });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const rows = Array.isArray(state.data)
    ? state.data
    : Array.isArray(state.data?.items)
      ? state.data.items
      : EMPTY;

  return {
    data: rows,
    single: state.data,
    loading: state.loading,
    error: state.error,
    reload,
  };
}
