import { Router } from "express";
import { createOne, getAll } from "../controllers/userController.js";

const userRouter = Router();

// (req, res) => {req.query}
userRouter.route("/").get(getAll).post(createOne);

export default userRouter;