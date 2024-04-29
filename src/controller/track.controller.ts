/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Track from "../models/tracks";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
const geoip = require("geoip-lite");
dotenv.config();

export const createTrackEvent = async (req: Request, res: Response) => {
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (ip === "::1" || ip?.includes("127.0.0.1")) {
    ip = "8.8.8.8";
  }

  const geo = geoip.lookup(ip);

  const track = new Track({
    _id: new mongoose.Types.ObjectId().toString(),
    event_name: req.body.event_name,
    metadata: {
      ...req.body.metadata,
      location: geo,
    },
  });

  try {
    const newTrack = await track.save();
    res.status(201).json(newTrack);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
