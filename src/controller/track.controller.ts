/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Track from "../models/tracks";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const createTrackEvent = async (req: Request, res: Response) => {
  const track = new Track({
    _id: new mongoose.Types.ObjectId().toString(),
    event_name: req.body.event_name,
    metadata: req.body.metadata,
  });

  try {
    const newTrack = await track.save();
    res.status(201).json(newTrack);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
