import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  admin_id: mongoose.Types.ObjectId;
  game_type: mongoose.Types.ObjectId;
  team_type: mongoose.Types.ObjectId;
  age_type: mongoose.Types.ObjectId;
  team_place: string;
  team_name: string;
  team_code: string;
  image: string;
  season_type: mongoose.Types.ObjectId;
  players_id: mongoose.Types.ObjectId[];
  coachs_id: mongoose.Types.ObjectId[];
}

const teamSchema = new Schema<ITeam>(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    game_type: { type: Schema.Types.ObjectId, ref: 'GameType', required: true },
    team_type: { type: Schema.Types.ObjectId, ref: 'TeamType', required: true },
    age_type: { type: Schema.Types.ObjectId, ref: 'AgeType', required: true },
    team_place: { type: String, required: true },
    image: { type: String,default:null, required: false },
    team_name: { type: String, required: true },
    team_code: { type: String, required: true, unique: true },
    season_type: { type: Schema.Types.ObjectId, ref: 'SeasonType', required: true },
    players_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    coachs_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Team = mongoose.model<ITeam>('Team', teamSchema);
export { Team };
