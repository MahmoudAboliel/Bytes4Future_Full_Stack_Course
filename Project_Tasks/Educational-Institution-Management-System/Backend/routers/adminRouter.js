import { Router } from "express";
import * as ctrl from "../controllers/adminController.js";
import validate from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  createUserSchema,
  updateUserSchema,
  toggleActiveSchema,
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

const router = Router();

// كل مسارات الأدمن تحتاج مصادقة + دور admin
router.use(protect, restrictTo("admin"));

// ---- Dashboard ----
router.get("/stats", ctrl.stats);
router.get("/activity", ctrl.activity);

// ---- Users ----
router
  .route("/users")
  .get(ctrl.listUsers)
  .post(validate(createUserSchema), ctrl.createUser);

router
  .route("/users/:id")
  .get(ctrl.getUser)
  .put(validate(updateUserSchema), ctrl.updateUser)
  .delete(ctrl.deleteUser);

router.patch(
  "/users/:id/active",
  validate(toggleActiveSchema),
  ctrl.toggleUserActive,
);

// ---- Approvals ----
router.get("/approvals", ctrl.listApprovals);
router.post("/approvals/:collection/:id/approve", ctrl.approve);
router.post("/approvals/:collection/:id/reject", ctrl.reject);

// ---- Reports ----
router.get("/reports/overview", ctrl.reportOverview);
router.get("/reports/cohorts/:id", ctrl.reportCohort);
router.get("/reports/export", ctrl.exportReport);

// ---- Cohorts ----
router
  .route("/cohorts")
  .get(ctrl.listCohorts)
  .post(validate(cohortSchema), ctrl.createCohort);

router
  .route("/cohorts/:id")
  .get(ctrl.getCohort)
  .put(validate(updateCohortSchema), ctrl.updateCohort)
  .delete(ctrl.deleteCohort);

router.get("/cohorts/:id/enrollments", ctrl.listCohortEnrollments);

// ---- Courses ----
router
  .route("/courses")
  .get(ctrl.listCourses)
  .post(validate(courseSchema), ctrl.createCourse);

router
  .route("/courses/:id")
  .put(validate(updateCourseSchema), ctrl.updateCourse)
  .delete(ctrl.deleteCourse);

// ---- Levels ----
router
  .route("/levels")
  .get(ctrl.listLevels)
  .post(validate(levelSchema), ctrl.createLevel);

router
  .route("/levels/:id")
  .put(validate(updateLevelSchema), ctrl.updateLevel)
  .delete(ctrl.deleteLevel);

export default router;
