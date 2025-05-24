import mongoose, { Document, Schema } from "mongoose";

export interface ITeamType extends Document {
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamTypeSchema = new Schema<ITeamType>(
  {
    title: { type: String, required: true, trim: true, unique:true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

export const TeamType = mongoose.model<ITeamType>("TeamType", teamTypeSchema);
