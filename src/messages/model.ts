// models/Message.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  team_id: mongoose.Types.ObjectId;
  player_id: mongoose.Types.ObjectId;
  message: string;
  timestamp: Date;
}

const teamMessageSchema = new Schema<IMessage>({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model<IMessage>('Message', teamMessageSchema);
export { Message };