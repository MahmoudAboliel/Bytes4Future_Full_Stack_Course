import Actor from "../models/actorModel.js";
import { isValidObjectId } from "mongoose";
import { getActorMovies } from "./movieCastService.js";

export const createActor = (actorData) => {
  const actor = new Actor(actorData);
  return actor.save();
};

export const getAllActors = (page = 1, limit = 10) => Actor.find();
// .skip((page - 1) * limit)
// .limit(limit);

export const getActorById = async (actorId) => {
  if (!isValidObjectId(actorId)) {
    throw new Error(`Invalid actor ID: ${actorId}`);
  }
  const actor = await Actor.findById(actorId).lean();
  if (!actor) {
    throw new Error("Actor not found");
  }

  const movies = await getActorMovies(actorId);
  return { ...actor, movies: movies.map((movie) => movie.movie) };
};

export const updateActor = (actorId, actorData) => {
  if (!isValidObjectId(actorId)) {
    throw new Error(`Invalid actor ID: ${actorId}`);
  }
  return Actor.findByIdAndUpdate(actorId, actorData, { new: true });
};

export const deleteActor = (actorId) => {
  if (!isValidObjectId(actorId)) {
    throw new Error(`Invalid actor ID: ${actorId}`);
  }
  return Actor.findByIdAndDelete(actorId);
};
