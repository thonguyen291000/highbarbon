/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Restaurant from "../models/restaurants";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Branch from "../models/branches";
dotenv.config();

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  const restaurant = new Restaurant({
    _id: new mongoose.Types.ObjectId().toString(),
    branch_id: req.body.branch_id,
    name: req.body.name,
    address: req.body.address,
    image: req.body.image,
    phone: req.body.phone,
    tables: [],
  });

  await Branch.findByIdAndUpdate(
    restaurant.branch_id,
    { $push: { restaurants: restaurant._id } },
    { new: true, useFindAndModify: false }
  );

  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (restaurant == null) {
      return res.status(404).json({ message: "Cannot find restaurant" });
    }
    res.json(restaurant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant == null) {
      return res.status(404).json({ message: "Cannot find restaurant" });
    }
    await restaurant.remove();
    res.json({ message: "Deleted Restaurant" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
