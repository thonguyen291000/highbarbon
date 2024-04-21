import { Document, Schema, model } from "mongoose";
export interface IBranch extends Document {
  name: string;
  description?: string;
  restaurants: string[];
  image: string;
}

const branchSchema = new Schema(
  {
    _id: { type: String, require },
    name: { type: String, require },
    description: { type: String },
    restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
    image: { type: String, require },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model<IBranch>("Branch", branchSchema);
