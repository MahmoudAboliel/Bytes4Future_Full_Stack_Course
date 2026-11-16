import express from "express";
import cors from "cors";
import movieRouter from "./routes/movieRoute.js";
import actorRouter from "./routes/actorRoute.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/movies", movieRouter);
app.use("/api/actors", actorRouter);

export default app;