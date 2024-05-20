import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservation,
  updateReservation,
} from "../controller/reservation.controller";

const reservationRouter: Router = Router();

reservationRouter.get("/", getReservation);
reservationRouter.post("/", createReservation);
reservationRouter.put("/:id", updateReservation);
reservationRouter.delete("/:id", deleteReservation);

export default reservationRouter;
