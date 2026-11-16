import Movie from "../models/movieModel.js";
import { isValidObjectId } from "mongoose";
import { getMovieCast } from "./movieCastService.js";

export const createMovie = (movieData) => {
  const movie = new Movie(movieData);
  return movie.save();
};

export const getAllMovies = (page = 1, limit = 10) => Movie.find().lean();
// .skip((page - 1) * limit)
// .limit(limit);

export const getMovieById = async (movieId) => {
  if (!isValidObjectId(movieId)) {
    throw new Error(`Invalid movie ID: ${movieId}`);
  }
  const movie = await Movie.findById(movieId).lean();
  if (!movie) {
    throw new Error("Movie not found");
  }

  const actors = await getMovieCast(movieId);
  return { ...movie, actors: actors.map((cast) => cast.actor) };
};

export const updateMovie = (movieId, movieData) => {
  if (!isValidObjectId(movieId)) {
    throw new Error(`Invalid movie ID: ${movieId}`);
  }
  return Movie.findByIdAndUpdate(movieId, movieData, { new: true }).lean();
};

export const deleteMovie = (movieId) => {
  if (!isValidObjectId(movieId)) {
    throw new Error(`Invalid movie ID: ${movieId}`);
  }
  return Movie.findByIdAndDelete(movieId).lean();
};
