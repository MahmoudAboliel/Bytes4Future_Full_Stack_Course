import { Router } from "express";
import {
  createNewUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.route("/").get(getAllUsers).post(createNewUser);
userRouter.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default userRouter;
