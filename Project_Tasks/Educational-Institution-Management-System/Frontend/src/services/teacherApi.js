/**
 * Teacher API — maps to the role-scoped backend router `/api/teacher`
 * (Backend/routers/teacherRouter.js).
 *
 * Every collection is already scoped to the signed-in teacher by the
 * backend, so the UI never has to filter by `teacherId`.
 */

import { api, unwrapList, unwrapOne, PAGE_SIZE } from "./api.js";

const listQuery = (extra = {}) => ({ limit: PAGE_SIZE, ...extra });

/**
 * The teacher students endpoint returns roster rows shaped as
 * `{ enrollmentId, studentId, fullName, email, study, average, attendance }`.
 * We map them to plain user records so the shared `byId(users, id)` helper
 * keeps working across the UI.
 */
const toUser = (row) => ({
  id: row.studentId ?? row.id,
  _id: row.studentId ?? row._id,
  fullName: row.fullName,
  email: row.email,
  phone: row.phone,
  study: row.study,
  role: "student",
  isActive: true,
});

export const teacherApi = {
  stats: () => unwrapOne(api.get("/teacher/stats")),
  upcomingSessions: (limit = 5) =>
    unwrapList(api.get("/teacher/sessions/upcoming", { query: { limit } })),

  /* --------------------------------- cohorts -------------------------------- */
  cohorts: {
    /** Already limited to the teacher's own cohorts by the backend. */
    list: (query) =>
      unwrapList(api.get("/teacher/cohorts", { query: listQuery(query) })),
  },

  /* --------------------------- catalog (courses + levels) ------------------- */
  catalog: {
    /** `{ courses, levels }` limited to the teacher's cohorts. */
    get: () => unwrapOne(api.get("/teacher/catalog")),
  },

  /* --------------------------------- students ------------------------------- */
  students: {
    /** Roster rows (one per enrollment). */
    list: (query) =>
      unwrapList(api.get("/teacher/students", { query: listQuery(query) })),
    /** Plain user records (id = student id). */
    listAsUsers: async (query) => {
      const rows = await unwrapList(
        api.get("/teacher/students", { query: listQuery(query) }),
      );
      return rows.map(toUser);
    },
  },

  /* --------------------------------- sessions ------------------------------- */
  sessions: {
    list: (query) =>
      unwrapList(api.get("/teacher/sessions", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/teacher/sessions", data)),
    update: (id, data) => unwrapOne(api.put(`/teacher/sessions/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/teacher/sessions/${id}`)),
  },

  /* ------------------------------- enrollments ------------------------------ */
  enrollments: {
    /**
     * The teacher router has no flat enrollment collection, so it is built
     * from the roster of every cohort the teacher owns.
     */
    list: async () => {
      const rows = await unwrapList(
        api.get("/teacher/students", { query: listQuery() }),
      );
      return rows.map((row) => ({
        id: row.enrollmentId,
        _id: row.enrollmentId,
        studentId: row.studentId,
        cohortId: row.cohortId,
        status: row.status || "active",
        enrolledAt: row.enrolledAt,
        isActive: true,
      }));
    },
  },

  /* -------------------------------- attendances ----------------------------- */
  attendance: {
    /** The backend requires `sessionId` for this collection. */
    list: (sessionId) =>
      unwrapList(api.get("/teacher/attendance", { query: { sessionId } })),
    /** Convenience helper: merge the attendance of several sessions. */
    listForSessions: async (sessionIds = []) => {
      const lists = await Promise.all(
        sessionIds.map((sessionId) =>
          unwrapList(api.get("/teacher/attendance", { query: { sessionId } })),
        ),
      );
      return lists.flat();
    },
    /** Upsert a single attendance record. */
    upsert: (data) => unwrapOne(api.post("/teacher/attendance", data)),
    summary: (limit = 5) =>
      unwrapList(api.get("/teacher/attendance/summary", { query: { limit } })),
  },

  /* ---------------------------------- results ------------------------------- */
  results: {
    list: (query) =>
      unwrapList(api.get("/teacher/results", { query: listQuery(query) })),
    create: (data) => unwrapOne(api.post("/teacher/results", data)),
    update: (id, data) => unwrapOne(api.put(`/teacher/results/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/teacher/results/${id}`)),
    approveAll: (cohortId) =>
      unwrapOne(api.post("/teacher/results/approve-all", { cohortId })),
  },

  /* ----------------------------------- notes -------------------------------- */
  notes: {
    list: (query) =>
      unwrapList(api.get("/teacher/notes", { query: listQuery(query) })),
    get: (id) => unwrapOne(api.get(`/teacher/notes/${id}`)),
    create: (data) => unwrapOne(api.post("/teacher/notes", data)),
    update: (id, data) => unwrapOne(api.put(`/teacher/notes/${id}`, data)),
    remove: (id) => unwrapOne(api.remove(`/teacher/notes/${id}`)),
  },
};

export default teacherApi;
