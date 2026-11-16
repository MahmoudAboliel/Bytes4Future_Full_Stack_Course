import { Router } from "express";
import * as ctrl from "../controllers/studentController.js";
import validate from "../middleware/validate.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { updateSelfSchema } from "../validators/userValidator.js";

const router = Router();

// كل مسارات الطالب تحتاج مصادقة + دور student
router.use(protect, restrictTo("student"));

router.get("/me", ctrl.me);
router.get("/cohorts", ctrl.myCohorts);
router.get("/grades", ctrl.myGrades);
router.get("/attendance", ctrl.myAttendance);
router.get("/notes", ctrl.myNotes);
router.get("/catalog", ctrl.catalog);
router.put("/me", validate(updateSelfSchema), ctrl.updateMe);

export default router;
