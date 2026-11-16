import { Router } from "express";
import * as ctrl from "../controllers/teacherController.js";
import validate from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createSessionSchema,
  updateSessionSchema,
  attendanceSchema,
  createResultSchema,
  updateResultSchema,
  approveAllSchema,
} from "../validators/teacherValidator.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../validators/noteValidator.js";

const router = Router();

// كل مسارات المدرس تحتاج مصادقة + دور teacher
router.use(protect, restrictTo("teacher"));

/* ---------- Dashboard ---------- */
router.get("/stats", ctrl.stats);
router.get("/cohorts", ctrl.myCohorts);
router.get("/sessions/upcoming", ctrl.upcomingSessions);

/* ---------- Catalog (courses + levels of the teacher cohorts) ---------- */
router.get("/catalog", ctrl.catalog);

/* ---------- Sessions ---------- */
router.get("/sessions", ctrl.listSessions);
router.post("/sessions", validate(createSessionSchema), ctrl.createSession);
router.put("/sessions/:id", validate(updateSessionSchema), ctrl.updateSession);
router.delete("/sessions/:id", ctrl.deleteSession);

/* ---------- Attendance ---------- */
router.get("/attendance", ctrl.listAttendance);
router.post("/attendance", validate(attendanceSchema), ctrl.upsertAttendance);
router.get("/attendance/summary", ctrl.attendanceSummary);

/* ---------- Results ---------- */
router.get("/results", ctrl.listResults);
router.post("/results", validate(createResultSchema), ctrl.createResult);
router.post(
  "/results/approve-all",
  validate(approveAllSchema),
  ctrl.approveAll,
);
router.put("/results/:id", validate(updateResultSchema), ctrl.updateResult);
router.delete("/results/:id", ctrl.deleteResult);

/* ---------- Students ---------- */
router.get("/students", ctrl.listStudents);

/* ---------- Notes ---------- */
router.get("/notes", ctrl.listNotes);
router.post("/notes", validate(createNoteSchema), ctrl.createNote);
router.put("/notes/:id", validate(updateNoteSchema), ctrl.updateNote);
router.delete("/notes/:id", ctrl.deleteNote);

export default router;
