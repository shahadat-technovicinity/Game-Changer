import mongoose, { Document, Schema } from "mongoose";

export interface IGameType extends Document {
  title: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const gameTypeSchema = new Schema<IGameType>(
  {
    title: { type: String, required: true, trim: true, unique:true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

export const GameType = mongoose.model<IGameType>("GameType", gameTypeSchema);
