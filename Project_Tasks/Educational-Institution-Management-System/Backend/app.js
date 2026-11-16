import express from "express";
import cors from "cors";
import authRouter from "./routers/authRoute.js";
import adminRouter from "./routers/adminRouter.js";
import secretaryRouter from "./routers/secretaryRoute.js";
import teacherRouter from "./routers/teacherRouter.js";
import studentRouter from "./routers/studentRouter.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/secretary", secretaryRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/student", studentRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Central error handler — keeps every failure in the { message } envelope
// expected by the frontend API layer.
app.use(errorHandler);

export default app;
