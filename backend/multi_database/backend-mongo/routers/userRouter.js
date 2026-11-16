import { Router } from "express";
import {
  createNewUserController,
  deletUserController,
  findUserByIdController,
  getUsersController,
  updateUserController,
} from "../controllers/UserController.js";

const userRouter = Router();

userRouter.route("/").get(getUsersController).post(createNewUserController);
userRouter
  .route("/:id")
  .get(findUserByIdController)
  .put(updateUserController)
  .delete(deletUserController);

  
// userRouter.get("/", getUsersController);
// userRouter.get("/:id", findUserByIdController);
// userRouter.post("/", createNewUserController);
// userRouter.put("/:id", updateUserController);
// userRouter.delete("/:id", deletUserController);
export default userRouter;
