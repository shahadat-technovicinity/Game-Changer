// models/video.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  user: mongoose.Types.ObjectId;
  event_id: mongoose.Types.ObjectId; // added to match schema
  title?: string;
  description?: string;
  url: string;
  public_id: string;
  size: number; // in MB
  duration?: number; // in seconds
  format?: string;
  created_at: Date;
}

const VideoSchema = new Schema<IVideo>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }, // optional, if related to an event
  title: { type: String },
  description: { type: String },
  url: { type: String, required: true }, // Cloudinary secure_url
  public_id: { type: String }, // Cloudinary public_id (for delete)
  size: { type: Number }, // in MB
  duration: { type: Number }, // optional, in seconds
  format: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IVideo>('Video', VideoSchema);
