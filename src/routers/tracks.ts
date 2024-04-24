import { Router } from "express";
import { createTrackEvent } from "../controller/track.controller";

const trackRouter: Router = Router();

// trackRouter.get("/", getReservation);
trackRouter.post("/", createTrackEvent);

export default trackRouter;
