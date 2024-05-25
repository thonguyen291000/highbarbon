/* eslint-disable prettier/prettier */
import { Request, Response } from "express";
import Reservation from "../models/reservation";
import Tables from "../models/tables";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import Table from "../models/tables";
import { ReservationStatuses } from "../const";
dotenv.config();

export const getReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.find();

    const reservationWithTableInfo = [];

    for (let index = 0; index < reservation.length; index++) {
      const item = reservation[index];

      const table = await Tables.findById(item.table_id);

      reservationWithTableInfo.push({
        ...item.toObject(),
        table,
      });
    }

    res.json(reservationWithTableInfo);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  const table = await Table.findById(req.body.table_id);

  if (table == null) {
    return res.status(404).json({ message: "Cannot find table" });
  }

  const reservationDates = Object.keys(req.body.reservation_time);

  reservationDates.forEach((date: string) => {
    if (table.calendar) {
      const dateHours = table.calendar[date];

      req.body.reservation_time?.[date].forEach((hour: number) => {
        if (!!dateHours?.[hour] || dateHours?.[hour] === "") {
          return res
            .status(400)
            .json({ message: `Table is already reserved at ${hour}` });
        }
      });
    }
  });

  const newTableCalendar = { ...(table.calendar || {}) };

  reservationDates.forEach((date: string) => {
    let hours: any = {};
    req.body.reservation_time?.[date].forEach((hour: number) => {
      hours = {
        ...hours,
        [hour]: "",
      };
    });

    if (newTableCalendar[date]) {
      newTableCalendar[date] = { ...newTableCalendar[date], ...hours };
    } else {
      newTableCalendar[date] = hours;
    }
  });

  // reservation_time: {'29/10/2024': [1,2,3,4]}
  const reservation = new Reservation({
    _id: new mongoose.Types.ObjectId().toString(),
    table_id: req.body.table_id,
    branch_id: req.body.branch_id,
    restaurant_id: req.body.restaurant_id,
    username: req.body.username,
    phone: req.body.phone,
    amount_of_people: req.body.amount_of_people,
    reservation_time: req.body.reservation_time,
  });

  await Table.findByIdAndUpdate(
    reservation.table_id,
    {
      $push: { reservation: reservation._id },
      $set: { calendar: newTableCalendar },
    },
    { new: true, useFindAndModify: false }
  );

  try {
    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (reservation == null) {
      return res.status(404).json({ message: "Cannot find reservation" });
    }

    if (req.body.status === ReservationStatuses.deleted) {
      const table = await Table.findById(reservation?.table_id);

      const dateKeys = Object.keys(reservation.reservation_time || {});

      const newTableCalendar: Record<string, Record<string, boolean>> = {};

      dateKeys.forEach((key: string) => {
        const hours = reservation.reservation_time[key];

        newTableCalendar[key] = {};

        hours.forEach((hour) => {
          newTableCalendar[key][hour] = false;
        });
      });

      await Table.findByIdAndUpdate(
        reservation?.table_id,
        {
          calendar: {
            ...table?.calendar,
            ...newTableCalendar,
          },
        },
        {
          new: true,
        }
      );
    }

    if (req.body.status === ReservationStatuses.done) {
      const table = await Table.findById(reservation?.table_id);

      const dateKeys = Object.keys(reservation.reservation_time || {});

      const newTableCalendar: Record<string, Record<string, boolean>> = {};

      dateKeys.forEach((key: string) => {
        const hours = reservation.reservation_time[key];

        newTableCalendar[key] = {};

        hours.forEach((hour) => {
          newTableCalendar[key][hour] = true;
        });
      });

      await Table.findByIdAndUpdate(
        reservation?.table_id,
        {
          calendar: {
            ...table?.calendar,
            ...newTableCalendar,
          },
        },
        {
          new: true,
        }
      );
    }

    res.json(reservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (reservation == null) {
      return res.status(404).json({ message: "Cannot find reservation" });
    }
    await reservation.remove();
    res.json({ message: "Deleted Reservation" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
