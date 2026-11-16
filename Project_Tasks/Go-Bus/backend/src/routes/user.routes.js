import { Router } from "express";

import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

import {
  getUserByIdController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("admin", "secretary"),
  getAllUsersController,
);

router.get(
  "/:_id",
  authenticate,
  authorize("admin", "secretary"),
  getUserByIdController,
);

router.patch(
  "/:_id",
  authenticate,
  authorize("admin", "secretary"),
  updateUserController,
);

router.delete(
  "/:_id",
  authenticate,
  authorize("admin", "secretary"),
  deleteUserController,
);

export default router;
