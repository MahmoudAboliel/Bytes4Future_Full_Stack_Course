import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  }),
);
app.use("/users", userRouter);

export default app;
