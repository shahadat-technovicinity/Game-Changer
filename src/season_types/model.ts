import mongoose, { Document, Schema } from "mongoose";

export interface ISeasonType extends Document {
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const seasonTypeSchema = new Schema<ISeasonType>(
  {
    title: { type: String, required: true, trim: true, unique:true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

export const SeasonType = mongoose.model<ISeasonType>("SeasonType", seasonTypeSchema);
