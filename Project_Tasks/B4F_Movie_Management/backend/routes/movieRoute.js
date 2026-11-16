import { Router } from "express";
import * as vld from "../validators/movieValidator.js";
import * as ctr from "../controllers/movieController.js";
import validate from "../middlewares/validate.js";

const movieRouter = Router();

movieRouter.get("/", ctr.getMovies);
movieRouter.post("/", validate(vld.movieSchema), ctr.addMovie);
movieRouter.get("/:movieId", ctr.getMovie);
movieRouter.put("/:movieId", validate(vld.updateMovieSchema), ctr.updateMovie);
movieRouter.delete("/:movieId", ctr.deleteMovie);
movieRouter.post("/:movieId", validate(vld.movieCastSchema), ctr.addMovieCast);

export default movieRouter;