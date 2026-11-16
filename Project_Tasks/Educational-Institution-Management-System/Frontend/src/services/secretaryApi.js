/**
 * Secretary API — maps to the role-scoped backend router `/api/secretary`
 * (Backend/routers/secretaryRoute.js).
 *
 * Notes:
 * - The router splits people into `/students` and `/teachers`; `users.list()`
 *   merges both so the UI can keep filtering by `role` client-side.
 * - The secretary is not a teacher, so the teacher-scoped attendance/result
 *   collections are exposed through the secretary-scoped read endpoints.
 */

import { api, unwrapList, unwrapOne, PAGE_SIZE } from "./api.js";

const listQuery = (extra = {}) => ({ limit: PAGE_SIZE, ...extra });

export const secretaryApi = {
  stats: () => unwrapOne(api.get("/secretary/stats")),

  /* --------------------------- people (students + teachers) ------------------ */
  users: {
    /** Everyone the secretary may manage: students and teachers. */
    list: async (query) => {
      const [students, teachers] = await Promise.all([
        unwrapList(
          api.get("/secretary/students", { query: listQuery(query) }),
        ),
        unwrapList(
          api.get("/secretary/teachers", { query: listQuery(query) }),
        ),
      ]);
      return [...students, ...teachers];
    },
  },

  /* --------------------------------- students -------------------------------- */
  students: {
    list: (query) =>
      unwrapList(api.get("/secretary/students", { query: listQuery(query) })),
    /** Students that are NOT enrolled in a given cohort. */
    listNotInCohort: (cohortId) =>
      unwrapList(
        api.get("/secretary/students", { query: { notIn: cohortId } }),
      ),
    get: (id) => unwrapOne(api.get(`/secretary/students/${id}`)),
    create: (data) => unwrapOne(api.post("/secretary/students", data)),
    update: (id, data) => unwrapOne(api.put(`/secretary/students/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/secretary/students/${id}`)),
  },

  /* --------------------------------- teachers -------------------------------- */
  teachers: {
    list: (query) =>
      unwrapList(api.get("/secretary/teachers", { query: listQuery(query) })),
    get: (id) => unwrapOne(api.get(`/secretary/teachers/${id}`)),
    create: (data) => unwrapOne(api.post("/secretary/teachers", data)),
    update: (id, data) => unwrapOne(api.put(`/secretary/teachers/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/secretary/teachers/${id}`)),
  },

  /* --------------------------------- courses --------------------------------- */
  courses: {
    list: (query) =>
      unwrapList(api.get("/secretary/courses", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/secretary/courses", data)),
    update: (id, data) => unwrapOne(api.put(`/secretary/courses/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/secretary/courses/${id}`)),
  },

  /* --------------------------------- levels ---------------------------------- */
  levels: {
    list: (query) =>
      unwrapList(api.get("/secretary/levels", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/secretary/levels", data)),
    update: (id, data) => unwrapOne(api.put(`/secretary/levels/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/secretary/levels/${id}`)),
  },

  /* --------------------------------- cohorts --------------------------------- */
  cohorts: {
    list: (query) =>
      unwrapList(api.get("/secretary/cohorts", { query: listQuery(query) })),
    get: (id) => unwrapOne(api.get(`/secretary/cohorts/${id}`)),
    create: (data) => unwrapOne(api.post("/secretary/cohorts", data)),
    update: (id, data) => unwrapOne(api.put(`/secretary/cohorts/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/secretary/cohorts/${id}`)),
    enrollments: (id) =>
      unwrapList(api.get(`/secretary/cohorts/${id}/enrollments`)),
  },

  /* --------------------------------- sessions -------------------------------- */
  sessions: {
    list: (query) =>
      unwrapList(api.get("/secretary/sessions", { query: listQuery(query) })),
  },

  /* ------------------------------- enrollments ------------------------------- */
  enrollments: {
    list: (query) =>
      unwrapList(api.get("/secretary/enrollments", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/secretary/enrollments", data)),
    /** Change the status of an enrollment (active | withdrawn | completed). */
    setStatus: (id, status) =>
      unwrapOne(api.patch(`/secretary/enrollments/${id}`, { status })),
  },

  /* -------------------------------- attendances ------------------------------- */
  attendances: {
    list: (query) =>
      unwrapList(api.get("/secretary/attendances", { query: listQuery(query) })),
  },

  /* ---------------------------------- results -------------------------------- */
  results: {
    list: (query) =>
      unwrapList(api.get("/secretary/results", { query: listQuery(query) })),
  },

  /* ----------------------------------- notes --------------------------------- */
  notes: {
    list: (query) =>
      unwrapList(api.get("/secretary/notes", { query: listQuery(query) })),
    get: (id) => unwrapOne(api.get(`/secretary/notes/${id}`)),
    create: (data) => unwrapOne(api.post("/secretary/notes", data)),
    update: (id, data) => unwrapOne(api.put(`/secretary/notes/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/secretary/notes/${id}`)),
  },
};

export default secretaryApi;
