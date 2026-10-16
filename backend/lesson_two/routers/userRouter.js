import { Router } from "express";
import {
  createController,
  getByIdController,
  getAllController,
  updateController,
  deleteController,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.route("/").get(getAllController).post(createController);
userRouter
  .route("/:id")
  .get(getByIdController)
  .patch(updateController)
  .delete(deleteController);

// userRouter.get("/", getAllController);
// userRouter.get("/:id", getByIdController);
// userRouter.post("/", createController);
// userRouter.patch("/:id", updateController);
// userRouter.delete("/:id", deleteController);

export default userRouter;
