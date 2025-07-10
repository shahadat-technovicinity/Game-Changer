import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  opponent_team_id: mongoose.Types.ObjectId;
  admin_id: mongoose.Types.ObjectId;
  team_id: mongoose.Types.ObjectId;
  event_type: 'Game' | 'Practice' | 'Other';
  home_away: 'TBD' | 'Home' | 'Away';
  start_date: Date;
  duration: number; // in minutes
  arrive_time?: number; // in minutes before event
  all_day: boolean;
  repeats: 'Never' | 'Daily' | 'Weekly' | 'Monthly';
  location?: string;
  notes?: string;
  image: string;
  is_live: Boolean;
  live_videos?: string[];
  uploaded_videos?: string[];
}

const eventSchema = new Schema<IEvent>(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team_id: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    opponent_team_id: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    event_type: { type: String, enum: ['Game', 'Practice', 'Other'], default: 'Game', required: true },
    home_away: { type: String, enum: ['TBD', 'Home', 'Away'], default: 'Home', required: true },
    start_date: { type: Date, required: true },
    duration: { type: Number, required: true },
    arrive_time: { type: Number, required: false },
    all_day: { type: Boolean, default: false },
    is_live: { type: Boolean, default: false },
    repeats: { type: String, enum: ['Never', 'Daily', 'Weekly', 'Monthly'], default: 'Never' },
    location: { type: String, default: null},
    image: { type: String, default: null},
    notes: { type: String, default: null},
    live_videos: [{ type: String, default: null }],
    uploaded_videos: [{ type: String, default: null }],
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>('Event', eventSchema);
export { Event };
