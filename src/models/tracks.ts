import { Document, Schema, model } from "mongoose";
export interface ITrack extends Document {
  event_name: string;
  metadata: typeof Object;
}

const trackSchema = new Schema(
  {
    _id: { type: String, require },
    event_name: { type: String, require },
    metadata: { type: Object },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default model<ITrack>("Track", trackSchema);
