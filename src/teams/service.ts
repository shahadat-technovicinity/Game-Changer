import { Team, ITeam } from './model';
import { queryHelper } from "../utils/queryHelper";
import { IUser, User } from '../users/model';
import { AppError } from '../utils/appError';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { sendEmail } from '../utils/emailService';
import mongoose from 'mongoose';

const create = async (data: Partial<ITeam>) => {
  const team = new Team(data);
  await User.findByIdAndUpdate(data?.admin_id, {
    $addToSet: { admin_teams: team._id },
  });
  return await team.save();
};

const update = async (
  id: string,
  data: Partial<ITeam>
): Promise<ITeam | null> => {
  return await Team.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const getAll = async (query: any): Promise<{ items: ITeam[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    Team.find(finalQuery)
      .populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type', 'players_id'])
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),
    Team.countDocuments(finalQuery),
  ]);
  const totalPages = Math.ceil(totalItems / limit);
  const paginationData = {
    totalItems,
    totalPages,
    currentPage: page,
    limit,
  };
  return { items, paginationData };
};

const getById = async (id: string) => {
  return await Team.findById(id).populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type', 'players_id']);
};

const addPlayer = async (teamId: string, data: Partial<IUser>) => {
  // Try to find the player by email
  let player = await User.findOne({ email: data.email });

  if (player) {
    // Update existing player's info
    player.first_name = data.first_name ?? player.first_name;
    player.last_name = data.last_name ?? player.last_name;
    player.role = data.role ?? player.role;
    player.team_id  = new mongoose.Types.ObjectId(teamId);
    await player.save();
  } else {
    // Create new player
    player = await User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
      team_id: teamId,
    });
  }

  // Update team with player if not already added
  const updatedTeam = await Team.findByIdAndUpdate(
    teamId,
    { $addToSet: { players_id: player._id } }, // Avoid duplicates
    { new: true }
  )
    .populate([
      { path: 'admin_id', select: 'first_name last_name email image' },
      'game_type',
      'team_type',
      'age_type',
      'season_type'
    ])
    .populate('players_id', 'first_name last_name email image role team_id');

  // Send Invitation Email
  const emailTemplatePath = path.resolve(
    __dirname,
    "..",
    "email_templates",
    "player_add_email.ejs"
  );

  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  const subject = `You're Invited to Join ${updatedTeam?.team_name} on Game Changer!`;
  const mailContent = ejs.render(emailTemplate, {
    name: `${player.first_name} ${player.last_name}`,
    email: player.email,
    team: updatedTeam?.team_name
  });

  sendEmail(player.email, subject, mailContent);

  return updatedTeam;
};



const removePlayer = async (id: string, player_id: string) => {

  await User.findByIdAndUpdate(
    player_id,
    { team_id: null },
    { new: true }
  );
  const updatedTeam = await Team.findByIdAndUpdate(
    id,
    { $pull: { players_id: player_id } }, // Removes playerId from array
    { new: true } // Returns updated document
  )
  .populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type'])
  .populate('players_id', 'first_name last_name email image role');

  return updatedTeam;
};

const remove = async (id: string): Promise<ITeam | null> => {
  return await Team.findByIdAndDelete(id);
};

const getPlayers = async (teamId: string,query: any): Promise<{ players: any[]; pagination: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const filter = {_id:teamId, ...finalQuery};
  const teams = await Team.find(filter).lean();
  const team = teams[0];
  if (!team) throw new AppError("Team not found", 404);

  const totalPlayers = team?.players_id.length;
  // Step 2: Paginate players manually using players_id
  const paginatedPlayerIds = team.players_id.slice(skip, skip + limit);
  // Step 3: Fetch user details
  const players = await User.find({ _id: { $in: paginatedPlayerIds } });

  return {
    players,
    pagination: {
      totalItems: totalPlayers,
      totalPages: Math.ceil(totalPlayers / limit),
      currentPage: page,
      limit
    }
  };
};
export const Service = { create,update,getAll, getById,addPlayer,removePlayer,getPlayers ,remove}

