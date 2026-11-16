import { Router } from "express";
import * as ctrl from "../controllers/secretaryController.js";
import validate from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator.js";
import {
  cohortSchema,
  updateCohortSchema,
} from "../validators/cohortValidator.js";
import {
  courseSchema,
  updateCourseSchema,
} from "../validators/courseValidator.js";
import {
  levelSchema,
  updateLevelSchema,
} from "../validators/levelValidator.js";
import {
  createEnrollmentSchema,
  patchEnrollmentSchema,
} from "../validators/EnrollmentValidator.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../validators/noteValidator.js";

const router = Router();

// كل مسارات السكرتيرة تحتاج مصادقة + دور secretary
router.use(protect, restrictTo("secretary"));

/* ---------- Dashboard ---------- */
router.get("/stats", ctrl.stats);

/* ---------- Students ---------- */
router.get("/students", (req, res, next) => {
  // التفريق بين القائمة العادية و "notIn"
  if (req.query.notIn) return ctrl.listStudentsNotInCohort(req, res, next);
  return ctrl.listStudents(req, res, next);
});
router.post("/students", validate(createUserSchema), ctrl.createStudent);
router.get("/students/:id", ctrl.getStudent);
router.put("/students/:id", validate(updateUserSchema), ctrl.updateStudent);
router.delete("/students/:id", ctrl.deleteStudent);

/* ---------- Teachers ---------- */
router.get("/teachers", ctrl.listTeachers);
router.post("/teachers", validate(createUserSchema), ctrl.createTeacher);
router.put("/teachers/:id", validate(updateUserSchema), ctrl.updateTeacher);
router.delete("/teachers/:id", ctrl.deleteTeacher);

/* ---------- Cohorts ---------- */
router.get("/cohorts", ctrl.listCohorts);
router.post("/cohorts", validate(cohortSchema), ctrl.createCohort);
router.get("/cohorts/:id", ctrl.getCohort);
router.put("/cohorts/:id", validate(updateCohortSchema), ctrl.updateCohort);
router.delete("/cohorts/:id", ctrl.deleteCohort);
router.get("/cohorts/:id/enrollments", ctrl.listCohortEnrollments);

/* ---------- Enrollments ---------- */
router.get("/enrollments", ctrl.listEnrollments);
router.post(
  "/enrollments",
  validate(createEnrollmentSchema),
  ctrl.createEnrollment,
);
router.patch(
  "/enrollments/:id",
  validate(patchEnrollmentSchema),
  ctrl.patchEnrollment,
);

/* ---------- Sessions ---------- */
router.get("/sessions", ctrl.listSessions);

/* ---------- Attendance (overview) ---------- */
router.get("/attendances", ctrl.listAttendances);

/* ---------- Results (overview) ---------- */
router.get("/results", ctrl.listResults);

/* ---------- Courses ---------- */
router.get("/courses", ctrl.listCourses);
router.post("/courses", validate(courseSchema), ctrl.createCourse);
router.put("/courses/:id", validate(updateCourseSchema), ctrl.updateCourse);
router.delete("/courses/:id", ctrl.deleteCourse);

/* ---------- Levels ---------- */
router.get("/levels", ctrl.listLevels);
router.post("/levels", validate(levelSchema), ctrl.createLevel);
router.put("/levels/:id", validate(updateLevelSchema), ctrl.updateLevel);
router.delete("/levels/:id", ctrl.deleteLevel);

/* ---------- Notes ---------- */
router.get("/notes", ctrl.listNotes);
router.post("/notes", validate(createNoteSchema), ctrl.createNote);
router.get("/notes/:id", ctrl.getNote);
router.put("/notes/:id", validate(updateNoteSchema), ctrl.updateNote);
router.delete("/notes/:id", ctrl.deleteNote);

export default router;
