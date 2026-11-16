import Movie from "../models/movieModel.js";
import Actor from "../models/actorModel.js";
import MovieCast from "../models/movieCastModel.js";
import { isValidObjectId } from "mongoose";

export const addMovieCast = async (
  movieId,
  data = [{ actorId: 0, characterName: "" }],
) => {
  if (!isValidObjectId(movieId)) {
    throw new Error(`Invalid movie ID: ${movieId}`);
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Cast data is empty");
  }

  data.forEach((cast) => {
    if (!isValidObjectId(cast.actorId)) {
      throw new Error(`Invalid actor ID: ${cast.actorId}`);
    }
  });

  const movie = await Movie.findById(movieId).lean();
  if (!movie) {
    throw new Error("Movie not found");
  }

  const actors = await Actor.find(
    { _id: { $in: data.map((cast) => cast.actorId) } },
    { _id: 1 },
  ).lean();

  const foundIds = new Set(actors.map((actor) => actor._id.toString()));
  const missingIds = data
    .filter((cast) => !foundIds.has(cast.actorId.toString()))
    .map((cast) => cast.actorId);

  if (missingIds.length > 0) {
    throw new Error(`Actors not found: ${missingIds.join(", ")}`);
  }

  const castDocs = data.map((cast) => ({
    movie: movieId,
    actor: cast.actorId,
    characterName: cast.characterName,
  }));

  const movieCast = await MovieCast.insertMany(castDocs);
  return movieCast;
};

export const getMovieCast = (movieId) =>
  MovieCast.find({ movie: movieId })
    .populate("actor", "name nationality image")
    .select("actor")
    .lean();

export const getActorMovies = (actorId) =>
  MovieCast.find({ actor: actorId })
    .populate("movie", "title rating genres image")
    .select("movie")
    .lean();

export const removeMovieCast = (movieId, actorId) =>
  MovieCast.findOneAndDelete({ movie: movieId, actor: actorId });

export const updateMovieCast = (movieId, actorId, characterName) =>
  MovieCast.findOneAndUpdate(
    { movie: movieId, actor: actorId },
    { characterName },
    { new: true },
  );
