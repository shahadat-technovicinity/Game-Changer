import mongoose, { Document, Schema } from "mongoose";

export interface IAgeType extends Document {
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ageTypeSchema = new Schema<IAgeType>(
  {
    title: { type: String, required: true, trim: true, unique:true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

export const AgeType = mongoose.model<IAgeType>("AgeType", ageTypeSchema);
