/**
 * Student API — maps to the role-scoped backend router `/api/student`
 * (Backend/routers/studentRouter.js).
 *
 * The student router returns ready-made views instead of raw collections:
 *   /me        -> the profile
 *   /cohorts   -> one row per enrollment with cohort + progress metrics
 *   /grades    -> one row per published result
 *   /attendance-> one row per attendance record
 *   /notes     -> notes visible to the student
 *   /catalog   -> the approved courses and their levels
 */

import { api, unwrapList, unwrapOne } from "./api.js";

export const studentApi = {
  /* --------------------------------- profile -------------------------------- */
  me: () => unwrapOne(api.get("/student/me")),
  /** Update the signed-in student's own profile. */
  updateMe: (data) => unwrapOne(api.put("/student/me", data)),

  /* --------------------------------- cohorts -------------------------------- */
  cohorts: {
    list: () => unwrapList(api.get("/student/cohorts")),
  },

  /* ---------------------------------- grades -------------------------------- */
  grades: {
    list: () => unwrapList(api.get("/student/grades")),
  },

  /* -------------------------------- attendance ------------------------------ */
  attendance: {
    list: () => unwrapList(api.get("/student/attendance")),
  },

  /* ----------------------------------- notes -------------------------------- */
  notes: {
    list: () => unwrapList(api.get("/student/notes")),
  },

  /* --------------------------------- catalog -------------------------------- */
  catalog: {
    /** `{ courses, levels }` of every approved course. */
    get: () => unwrapOne(api.get("/student/catalog")),
  },
};

export default studentApi;
