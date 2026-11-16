import * as userService from "../services/userService.js";
import * as courseService from "../services/courseService.js";
import * as levelService from "../services/levelService.js";
import * as cohortService from "../services/cohortService.js";
import * as sessionService from "../services/sessionService.js";
import * as enrollmentsSvc from "../services/enrollmentService.js";
import * as attendanceSvc from "../services/attendanceService.js";
import * as resultsSvc from "../services/resultService.js";
import * as notesSvc from "../services/noteService.js";
import * as statsSvc from "../services/secretaryService.js";
import {catchAsync, ok, created} from "../utils/lib.js";
import AppError from "../utils/AppError.js";

/* ============================================================
 * Dashboard
 * ============================================================ */
export const stats = catchAsync(async (req, res) =>
  ok(res, await statsSvc.getSecretaryStats()),
);

/* ============================================================
 * Students  (role = student)
 * ============================================================ */
export const listStudents = catchAsync(async (req, res) => {
  const { items, meta } = await userService.listUsers({
    ...req.query,
    role: "student",
  });
  ok(res, { items, meta });
});

export const getStudent = catchAsync(async (req, res) =>
  ok(res, await userService.getUser(req.params.id)),
);

export const createStudent = catchAsync(async (req, res) => {
  const data = { ...req.body, role: "student" };
  created(res, await userService.createUser(data));
});

export const updateStudent = catchAsync(async (req, res) => {
  const data = { ...req.body };
  delete data.role; // منع تغيير الدور
  ok(res, await userService.updateUser(req.params.id, data));
});

export const deleteStudent = catchAsync(async (req, res) => {
  // نتأكد أنه طالب حقًا قبل الحذف
  const user = await userService.getUser(req.params.id);
  if (user.role !== "student") throw new AppError("User is not a student", 400);
  ok(res, await userService.deleteUser(req.params.id));
});

/* ============================================================
 * Teachers  (role = teacher)
 * ============================================================ */
export const listTeachers = catchAsync(async (req, res) => {
  const { items, meta } = await userService.listUsers({
    ...req.query,
    role: "teacher",
  });
  ok(res, { items, meta });
});

export const createTeacher = catchAsync(async (req, res) => {
  const data = { ...req.body, role: "teacher" };
  created(res, await userService.createUser(data));
});

export const updateTeacher = catchAsync(async (req, res) => {
  const data = { ...req.body };
  delete data.role;
  ok(res, await userService.updateUser(req.params.id, data));
});

export const deleteTeacher = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  if (user.role !== "teacher") throw new AppError("User is not a teacher", 400);
  ok(res, await userService.deleteUser(req.params.id));
});

/* ============================================================
 * Cohorts
 * ============================================================ */
export const listCohorts = catchAsync(async (req, res) => {
  const { items, meta } = await cohortService.listCohorts(req.query);
  ok(res, { items, meta });
});

export const getCohort = catchAsync(async (req, res) =>
  ok(res, await cohortService.getCohort(req.params.id)),
);

export const createCohort = catchAsync(async (req, res) =>
  created(res, await cohortService.createCohort(req.body)),
);

export const updateCohort = catchAsync(async (req, res) =>
  ok(res, await cohortService.updateCohort(req.params.id, req.body)),
);

export const deleteCohort = catchAsync(async (req, res) =>
  ok(res, await cohortService.deleteCohort(req.params.id)),
);

export const listCohortEnrollments = catchAsync(async (req, res) =>
  ok(res, await cohortService.listCohortEnrollments(req.params.id)),
);

/* ============================================================
 * Enrollments
 * ============================================================ */
export const listEnrollments = catchAsync(async (req, res) => {
  const items = await enrollmentsSvc.listEnrollments(req.query);
  ok(res, { items, meta: { total: items.length } });
});

export const createEnrollment = catchAsync(async (req, res) =>
  created(res, await enrollmentsSvc.createEnrollment(req.body)),
);

export const patchEnrollment = catchAsync(async (req, res) =>
  ok(res, await enrollmentsSvc.patchEnrollment(req.params.id, req.body)),
);

/**
 * GET /api/secretary/students?notIn=:cohortId
 * يُرجع الطلاب غير المسجّلين في الدفعة
 */
export const listStudentsNotInCohort = catchAsync(async (req, res) => {
  const { notIn } = req.query;
  if (!notIn) throw new AppError("notIn (cohortId) is required", 400);
  ok(res, await enrollmentsSvc.listStudentsNotInCohort(notIn));
});

/* ============================================================
 * Sessions
 * ============================================================ */
export const listSessions = catchAsync(async (req, res) => {
  const { items, meta } = await sessionService.listAllSessions(req.query);
  ok(res, { items, meta });
});

/* ============================================================
 * Attendance (read-only overview for the secretary)
 * ============================================================ */
export const listAttendances = catchAsync(async (req, res) =>
  ok(res, await attendanceSvc.listAllAttendance(req.query)),
);

/* ============================================================
 * Results (read-only overview for the secretary)
 * ============================================================ */
export const listResults = catchAsync(async (req, res) => {
  const { items, meta } = await resultsSvc.listAllResults(req.query);
  ok(res, { items, meta });
});

/* ============================================================
 * Courses
 * ============================================================ */
export const listCourses = catchAsync(async (req, res) => {
  const { items, meta } = await courseService.listCourses(req.query);
  ok(res, { items, meta });
});

export const createCourse = catchAsync(async (req, res) =>
  created(res, await courseService.createCourse(req.body)),
);

export const updateCourse = catchAsync(async (req, res) =>
  ok(res, await courseService.updateCourse(req.params.id, req.body)),
);

export const deleteCourse = catchAsync(async (req, res) =>
  ok(res, await courseService.deleteCourse(req.params.id)),
);

/* ============================================================
 * Levels
 * ============================================================ */
export const listLevels = catchAsync(async (req, res) => {
  const { items, meta } = await levelService.listLevels(req.query);
  ok(res, { items, meta });
});

export const createLevel = catchAsync(async (req, res) =>
  created(res, await levelService.createLevel(req.body)),
);

export const updateLevel = catchAsync(async (req, res) =>
  ok(res, await levelService.updateLevel(req.params.id, req.body)),
);

export const deleteLevel = catchAsync(async (req, res) =>
  ok(res, await levelService.deleteLevel(req.params.id)),
);

/* ============================================================
 * Notes
 * ============================================================ */
export const listNotes = catchAsync(async (req, res) => {
  const { items, meta } = await notesSvc.listNotes(req.query);
  ok(res, { items, meta });
});

export const getNote = catchAsync(async (req, res) =>
  ok(res, await notesSvc.getNote(req.params.id)),
);

export const createNote = catchAsync(async (req, res) =>
  created(res, await notesSvc.createNote(req.body)),
);

export const updateNote = catchAsync(async (req, res) =>
  ok(res, await notesSvc.updateNote(req.params.id, req.body)),
);

export const deleteNote = catchAsync(async (req, res) =>
  ok(res, await notesSvc.deleteNote(req.params.id)),
);
