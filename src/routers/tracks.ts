import { Router } from "express";
import {
  createTrackEvent,
  getTrackEvents,
} from "../controller/track.controller";

const trackRouter: Router = Router();

trackRouter.get("/", getTrackEvents);
trackRouter.post("/", createTrackEvent);

export default trackRouter;
