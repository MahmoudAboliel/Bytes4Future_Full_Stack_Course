import * as asr from "../services/acotrservice.js";

export const addActor = async (request, response) => {
  try {
    const actorData = request.body;
    await asr.createActor(actorData);
    response.status(201).json({ message: "Actor added successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getActors = async (request, response) => {
  try {
    // const { page, limit } = request.query;
    const actors = await asr.getAllActors();
    response.status(200).json(actors);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const getActor = async (request, response) => {
  try {
    const { actorId } = request.params;
    const actor = await asr.getActorById(actorId);
    response.status(200).json(actor);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const updateActor = async (request, response) => {
  try {
    const { actorId } = request.params;
    const actorData = request.body;
    await asr.updateActor(actorId, actorData);
    response.status(200).json({ message: "Actor updated successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

export const deleteActor = async (request, response) => {
  try {
    const { actorId } = request.params;
    await asr.deleteActor(actorId);
    response.status(200).json({ message: "Actor deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};
