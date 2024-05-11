/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Track from "../models/tracks";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
const geoip = require("geoip-lite");
dotenv.config();

export const getTrackEvents = async (
  req: Request<
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    {
      id: string;
      phone: string;
      sortBy: string;
      eventName: string;
      unique: string;
      startDate: Date;
      endDate: Date;
      date: Date;
    }
  >,
  res: Response
) => {
  const { id, phone, sortBy, eventName, unique, startDate, endDate, date } =
    req.query;

  // Filter unique
  if (unique) {
    let uniqueItems = [];
    if (unique === "id") {
      uniqueItems = await Track.aggregate([
        { $group: { _id: "$metadata.id" } },
        { $project: { _id: 0, id: "$_id" } }, // Exclude _id field and rename it to phone
      ]);
    }

    if (unique === "phone") {
      uniqueItems = await Track.aggregate([
        { $group: { _id: "$metadata.phone" } },
        { $project: { _id: 0, phone: "$_id" } }, // Exclude _id field and rename it to phone
      ]);
    }

    return res.status(200).json({
      total: uniqueItems.length,
      uniqueItems,
    });
  }

  const query: any = {};

  if (date) {
    const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));

    query["createdAt"] = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  if (startDate || endDate) {
    query["createdAt"] = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  if (id) {
    query["metadata.id"] = id;
  }

  if (eventName) {
    query["event_name"] = eventName;
  }

  if (phone) {
    query["metadata.phone"] = phone;

    if (phone === "-1") {
      query["metadata.phone"] = { $exists: true };
    }
  }

  const sortCretiria: any = {};

  if (sortBy) {
    sortCretiria[`metadata.${sortBy}`] = 1;
  }

  const tracks = await Track.find(query).sort(sortCretiria);

  res.status(200).json({
    total: tracks.length,
    tracks,
  });
};

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
