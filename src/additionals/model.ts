import { Schema, model, Document } from "mongoose";

interface IBody {
  title: string;
  content: string;
}

interface IAdditional extends Document {
  type: "privacy_policy" | "terms_conditions" | "faq";
  body: IBody[]; // Now an array of objects
  updatedAt: Date;
}

const PageSchema = new Schema<IAdditional>(
  {
    type: {
      type: String,
      required: true,
      enum: ["privacy_policy", "terms_conditions", "faq"], // Allowed types
      unique: true, // Ensures only one of each type exists
    },
    body: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Additional = model<IAdditional>("Additional", PageSchema);
export { Additional, IAdditional };
