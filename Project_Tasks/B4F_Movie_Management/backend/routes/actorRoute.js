import * as clr from "../controllers/actorController.js";
import { Router } from "express";
import * as vld from "../validators/actorValidator.js";
import validate from "../middlewares/validate.js";

const actorRouter = Router();

actorRouter.get("/", clr.getActors);
actorRouter.post("/", validate(vld.actorSchema), clr.addActor);
actorRouter.get("/:actorId", clr.getActor);
actorRouter.put("/:actorId", validate(vld.updateActorSchema), clr.updateActor);
actorRouter.delete("/:actorId", clr.deleteActor);

export default actorRouter;