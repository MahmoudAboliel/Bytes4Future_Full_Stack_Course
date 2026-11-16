/**
 * Admin API — maps to the role-scoped backend router `/api/admin`
 * (Backend/routers/adminRouter.js).
 *
 * Every list endpoint returns `{ items, meta }`; `unwrapList` flattens it.
 */

import { api, unwrapList, unwrapOne, PAGE_SIZE } from "./api.js";

/** The UI filters client-side, so always request the biggest page. */
const listQuery = (extra = {}) => ({ limit: PAGE_SIZE, ...extra });

export const adminApi = {
  /* ---------------------------------- stats --------------------------------- */
  stats: () => unwrapOne(api.get("/admin/stats")),
  activity: (limit = 5) =>
    unwrapList(api.get("/admin/activity", { query: { limit } })),

  /* ---------------------------------- users --------------------------------- */
  users: {
    list: (query) =>
      unwrapList(api.get("/admin/users", { query: listQuery(query) })),
    get: (id) => unwrapOne(api.get(`/admin/users/${id}`)),
    create: (data) => unwrapOne(api.post("/admin/users", data)),
    update: (id, data) => unwrapOne(api.put(`/admin/users/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/admin/users/${id}`)),
    /** Dedicated toggle endpoint: body must be exactly `{ isActive }`. */
    setActive: (id, isActive) =>
      unwrapOne(api.patch(`/admin/users/${id}/active`, { isActive })),
  },

  /* -------------------------------- approvals ------------------------------- */
  approvals: {
    list: (collection) =>
      unwrapList(api.get("/admin/approvals", { query: { collection } })),
    approve: (collection, id) =>
      unwrapOne(api.post(`/admin/approvals/${collection}/${id}/approve`)),
    reject: (collection, id) =>
      unwrapOne(api.post(`/admin/approvals/${collection}/${id}/reject`)),
  },

  /* --------------------------------- courses -------------------------------- */
  courses: {
    list: (query) =>
      unwrapList(api.get("/admin/courses", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/admin/courses", data)),
    update: (id, data) => unwrapOne(api.put(`/admin/courses/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/admin/courses/${id}`)),
  },

  /* --------------------------------- levels --------------------------------- */
  levels: {
    list: (query) =>
      unwrapList(api.get("/admin/levels", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/admin/levels", data)),
    update: (id, data) => unwrapOne(api.put(`/admin/levels/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/admin/levels/${id}`)),
  },

  /* --------------------------------- cohorts -------------------------------- */
  cohorts: {
    list: (query) =>
      unwrapList(api.get("/admin/cohorts", { query: listQuery(query) })),
    get: (id) => unwrapOne(api.get(`/admin/cohorts/${id}`)),
    create: (data) => unwrapOne(api.post("/admin/cohorts", data)),
    update: (id, data) => unwrapOne(api.put(`/admin/cohorts/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/admin/cohorts/${id}`)),
    enrollments: (id) =>
      unwrapList(api.get(`/admin/cohorts/${id}/enrollments`)),
  },

  /* --------------------------------- reports -------------------------------- */
  reports: {
    overview: (query) =>
      unwrapOne(api.get("/admin/reports/overview", { query })),
    cohort: (id) => unwrapOne(api.get(`/admin/reports/cohorts/${id}`)),
    exportJson: (query) =>
      unwrapOne(api.get("/admin/reports/export", { query })),
  },
};

export default adminApi;
