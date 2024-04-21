import { Document, Schema, model } from "mongoose";
export interface IRestaurant extends Document {
  branch_id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  tables: string[];
}

const restaurantSchema = new Schema(
  {
    _id: { type: String, require },
    branch_id: { type: String, require },
    name: { type: String, require },
    address: { type: String, require },
    phone: { type: String, require },
    image: { type: String, require },
    tables: [{ type: Schema.Types.ObjectId, ref: "Table" }],
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model<IRestaurant>("Restaurant", restaurantSchema);
