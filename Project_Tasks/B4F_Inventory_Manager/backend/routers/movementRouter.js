import express from "express";
import {
  getAllMovements,
  getMovementById,
  createMovement,
} from "../controllers/MovementsController.js";

const movementRouter = express.Router();

movementRouter.route("/").get(getAllMovements).post(createMovement);

movementRouter.route("/:id").get(getMovementById);

export default movementRouter;
