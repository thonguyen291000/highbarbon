/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Branch from "../models/branches";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const getBranches = async (req: Request, res: Response) => {
  try {
    const branches = await Branch.find();
    return res.json(branches);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createBranch = async (req: Request, res: Response) => {
  const branch = new Branch({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    city: req.body.city,
    restaurants: [],
  });

  try {
    const newBranch = await branch.save();
    res.status(201).json(newBranch);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBranch = async (req: Request, res: Response) => {
  try {
    const updatedBranch = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBranch);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBranch = async (req: Request, res: Response) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted a branch" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
