import { Router } from "express";
import { createController } from "../controllers/userController.js";

const userRouter = Router();

userRouter.route("/").post(createController);

export default userRouter;