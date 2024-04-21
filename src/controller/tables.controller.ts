/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Table from "../models/tables";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Restaurant from "../models/restaurants";
dotenv.config();

export const getTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTable = async (req: Request, res: Response) => {
  const table = new Table({
    _id: new mongoose.Types.ObjectId().toString(),
    restaurant_id: req.body.restaurant_id,
    name: req.body.name,
    description: req.body.description,
    amount_of_booked: req.body.amount_of_booked,
    fee: req.body.fee,
    fee_unit: req.body.fee_unit,
    calendar: req.body.calendar,
    reservation: [],
  });

  await Restaurant.findByIdAndUpdate(
    table.restaurant_id,
    { $push: { tables: table._id } },
    { new: true, useFindAndModify: false }
  );

  try {
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (table == null) {
      return res.status(404).json({ message: "Cannot find table" });
    }
    res.json(table);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const table = await Table.findById(req.params.id);
    if (table == null) {
      return res.status(404).json({ message: "Cannot find table" });
    }
    await table.remove();
    res.json({ message: "Deleted Table" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
