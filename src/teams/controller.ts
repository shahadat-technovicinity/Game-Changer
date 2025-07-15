import { Request, Response } from 'express';
import {Service} from "./service";
import { catchAsync } from '../utils/catchAsync';
import { AppError } from "../utils/appError";
import { UploadCloudinary } from "../utils/uploadCloudinary";
import { ITeam, Team } from './model';
import { IUser, User, UserRole } from '../users/model';
import { generateUniqueReferralCode } from '../utils/generateUniqueCode';

const create = catchAsync(async (req: Request, res: Response) => {
  const admin_id = req.user._id;
  console.log("admin_id: ", admin_id);
  const { season_type,team_name,team_place,age_type,team_type,game_type} = req.body;
  if (!season_type && !team_name && !team_place && !age_type && !team_type && !game_type) {
    throw new AppError("Required fields are missing", 400);
  }

  let imageUrl = "";

  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    imageUrl = uploadResult.secure_url;
  }
  const team_code = await generateUniqueReferralCode();

  const payload: Partial<ITeam> = {
    admin_id,
    season_type,
    team_name,
    team_place,
    age_type,
    team_type,
    game_type,
    image: imageUrl,
    team_code
  };
  console.log("PayLoad: ", payload);
  const item = await Service.create(payload);
 

  res.status(201).json({
    success: true,
    message: "Team is created successfully",
    data: item,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { season_type,team_name,team_place,age_type,team_type,game_type, players_id } = req.body;
  if (!season_type && !team_name && !team_place && !age_type && !team_type && !game_type && !players_id && !req.file) {
    throw new AppError("At least one field must be provided", 400);
  }
 
   const payload: Partial<ITeam> = {};
 
   if (season_type) payload.season_type = season_type;
   if (team_name) payload.team_name = team_name;
   if (team_place) payload.team_place = team_place;
   if (age_type) payload.age_type = age_type;
   if (team_type) payload.team_type = team_type;
   if (game_type) payload.game_type = game_type;
 
   if (req.file) {
     const uploadResult = await UploadCloudinary(req.file);
     payload.image = uploadResult.secure_url;
   }
 
   const item = await Service.update(id, payload);
 
   if (!item) {
     throw new AppError("Team type not found", 404);
   }
 
   res.status(200).json({
     success: true,
     message: "Team is updated successfully",
     data: item,
   });
 });

const getAll = catchAsync(async (req: Request, res: Response) => {
  const {items,paginationData} = await Service.getAll(req.query);
  res.status(200).json({ success: true,message: "Retrived all teams successfully", data: items, pagination: paginationData });
});

const getOwnTeams = catchAsync(async (req: Request, res: Response) => {
  const  id  = req.user?._id;
  const user = await User.findById(id);
  if(!user){
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if(user.role === UserRole.COACH){
    const items = await Team.findById(user.team_id);
    const paginationData = {
    totalItems : 1,
    totalPages : 1,
    currentPage: 1,
    limit: 1,
  };
    res.status(200).json({ success: true,message: "Retrived all teams successfully", data: items, pagination: paginationData });
  }

  const {items,paginationData} = await Service.getOwnTeams(id,req.query);
  res.status(200).json({ success: true,message: "Retrived all teams successfully", data: items, pagination: paginationData });
});

const getPlayers = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { players, pagination } = await Service.getPlayers(id, req.query);
  res.status(200).json({ success: true, message: "Retrived all players of team successfully", data: players, pagination });
});
const getCoachs = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { coaches, pagination } = await Service.getCoachs(id, req.query);
  res.status(200).json({ success: true, message: "Retrived all players of team successfully", data: coaches, pagination });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const team = await Service.getById(req.params.id);
  res.status(200).json({ success: true,message: "Team is retrived successfully", data: team });
});

const addPlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, email, jersey_no} = req.body;
  if (!first_name || !email || !last_name || !jersey_no) {
    throw new AppError('Required fields are missing', 400);
  }
  const payload: Partial<IUser> = {
    first_name,
    last_name,
    email,
    role: UserRole.PLAYER,
    jersey_no
  };

  const user = await User.findOne({ email });
  if (user?.role === 'Admin') {
    throw new AppError('Admin cannot be added as a player', 400);
  }
  if (user?.role === 'Coach') {
    throw new AppError('Coach cannot be added as a player', 400);
  }

  const team = await Service.addPlayer(id,payload);
  res.status(200).json({ success: true,message: "Player added to the team successfully", data: team });

  // TODO: Send Email
  
});

const addCoach = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, email} = req.body;
  if (!first_name || !email || !last_name) {
    throw new AppError('Required fields are missing', 400);
  }
  const payload: Partial<IUser> = {
    first_name,
    last_name,
    email,
    role: UserRole.COACH
  };

  const user = await User.findOne({ email });
  if (user?.role === 'Admin') {
    throw new AppError('Admin cannot be added as a coach', 400);
  }
  if (user?.role === 'Coach') {
    throw new AppError('Coach cannot be added as a coach', 400);
  }
  
  const team = await Service.addCoach(id,payload);
  res.status(200).json({ success: true,message: "Coach added to the team successfully", data: team });

  // TODO: Send Email
  
});

const removePlayer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { player_id } = req.params;
  const team = await Service.removePlayer(id,player_id);
  res.status(200).json({ success: true,message: "Player removed from the team successfully", data: team });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const item = await Service.remove(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Team not found" });
  }
  res.status(200).json({ success: true, message: "Team deleted" });
});

export const Controller = { create,update, getById, getAll,addPlayer,addCoach,getCoachs,removePlayer,getPlayers,remove,getOwnTeams }