import express from "express";
import userRouter from "./routers/userRouter.js";
import cors from "cors";
const app = express();

app.use(express.json());
// app.use(cors());
app.use(
  cors({
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  }),
);

app.use("/users", userRouter);

export default app;
