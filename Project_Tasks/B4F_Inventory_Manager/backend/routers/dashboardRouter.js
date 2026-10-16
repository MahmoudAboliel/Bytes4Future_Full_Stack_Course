import express from "express";
import { dashboardController } from "../controllers/DashboardController.js";


const dashboardRouter = express.Router();

dashboardRouter.route("/").get(dashboardController);

export default dashboardRouter;