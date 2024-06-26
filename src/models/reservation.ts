import { Document, Schema, model } from "mongoose";
import { ReservationStatuses } from "../const";
export interface IReservation extends Document {
  table_id: string;
  restaurant_id: string;
  branch_id: string;
  username: string;
  phone: string;
  image: string;
  reservation_time: Record<string, string[]>;
}

const reservationSchema = new Schema(
  {
    _id: { type: String, require },
    table_id: { type: String, require },
    branch_id: { type: String, require },
    restaurant_id: { type: String, require },
    username: { type: String, require },
    phone: { type: String, require },
    amount_of_people: { type: Number, require },
    reservation_time: { type: Object, require },
    status: { type: String, require, default: ReservationStatuses.confirming },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model<IReservation>("Reservation", reservationSchema);
