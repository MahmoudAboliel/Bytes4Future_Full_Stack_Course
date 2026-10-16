import express from "express";
import cors from "cors";

import dashboardRouter from "./routers/dashboardRouter.js";
import movementRouter from "./routers/movementRouter.js";
import productRouter from "./routers/productRouter.js";

const app = express();

app.use(
  cors({
    exposedHeaders: ["Content-Range", "X-Content-Range"],
  }),
);

app.use(express.json());

app.use("/", dashboardRouter)
app.use("/movements", movementRouter);
app.use("/products", productRouter);

export default app;
