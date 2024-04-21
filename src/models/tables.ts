import { Document, Schema, model } from "mongoose";
export interface ITable extends Document {
  restaurant_id: string;
  name: string;
  description: string;
  amount_of_booked: number;
  fee: number;
  fee_unit: string;
  calendar: Record<string, Record<string, boolean>>;
  reservation: string[];
}

const tableSchema = new Schema(
  {
    _id: { type: String, require },
    restaurant_id: { type: String, require },
    name: { type: String, require },
    description: { type: String, require },
    amount_of_booked: { type: Number, default: 0 },
    fee: { type: Number, require },
    fee_unit: { type: String, require },
    calendar: { type: Object, require }, // calendar: {'29/10/2024': {1:true, 2:false, 3:true, 4:false, 5:true, 6:false, 7:true, 8:false, 9:true, 10:false, ... 24:false}}
    reservation: [{ type: Schema.Types.ObjectId, ref: "Reservation" }],
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model<ITable>("Table", tableSchema);
