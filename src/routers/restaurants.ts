import { Router } from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../controller/restaurants.controller";

const restaurantsRouter: Router = Router();

restaurantsRouter.get("/", getRestaurants);
restaurantsRouter.post("/", createRestaurant);
restaurantsRouter.put("/:id", updateRestaurant);
restaurantsRouter.put("/:id", deleteRestaurant);

export default restaurantsRouter;
