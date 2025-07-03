import { Request, Response } from 'express';
import {Service} from "./service";
import {catchAsync} from '../utils/catchAsync';
import { AppError } from "../utils/appError";
import { UploadCloudinary } from "../utils/uploadCloudinary";
import { IEvent } from './model';

const create = catchAsync(async (req: Request, res: Response) => {
  const admin_id = req.user._id;
  const {notes,location,repeats,all_day,arrive_time,duration,start_date,event_type,opponent_team_id,team_id,home_away} = req.body;
  if (!notes || !location || !repeats || !all_day || !arrive_time || !duration || !start_date || !event_type || !opponent_team_id || !team_id || !home_away) {
    throw new AppError("Required fields are missing", 400);
  }

  let imageUrl = "";
  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    imageUrl = uploadResult.secure_url;
  }

  const payload: Partial<IEvent> = {
    admin_id,
    notes,
    location,
    repeats,
    all_day,
    arrive_time,
    duration,
    start_date,
    event_type,
    opponent_team_id,
    team_id,
    home_away,
    image: imageUrl
  };
  const item = await Service.create(payload);
  res.status(201).json({
    success: true,
    message: "Event is created successfully",
    data: item,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await Service.getById(id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event is not found" });
  }
  res.status(200).json({ success: true,message: "Event is retrived successfully", data: event });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {notes,location,repeats,all_day,arrive_time,duration,start_date,event_type,opponent_team_id,team_id,home_away} = req.body;
  if (!notes && !location && !repeats && !all_day && !arrive_time && !duration && !start_date && !event_type && !opponent_team_id && !team_id && !home_away) {
    throw new AppError("Required fields are missing", 400);
  }

  let imageUrl = "";
  if (req.file) {
    const uploadResult = await UploadCloudinary(req.file);
    imageUrl = uploadResult.secure_url;
  }

  const payload: Partial<IEvent> = {};
    if(notes) payload.notes = notes;
    if(location) payload.location = location;
    if(repeats) payload.repeats = repeats;
    if(all_day) payload.all_day = all_day;
    if(arrive_time) payload.arrive_time = arrive_time;
    if(duration) payload.duration = duration;
    if(start_date) payload.start_date = start_date;
    if(event_type) payload.event_type = event_type;
    if(opponent_team_id) payload.opponent_team_id = opponent_team_id;
    if(team_id) payload.team_id = team_id;
    if(opponent_team_id) payload.opponent_team_id = opponent_team_id;
    if(home_away) payload.home_away = home_away;
    if(imageUrl) payload.image = imageUrl;
  const updated = await Service.update(id, payload);
  res.status(200).json({ success: true, message: 'Event is updated', data: updated });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const item = await Service.remove(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: "Event is not found" });
  }
  res.status(200).json({ success: true, message: "Event is deleted" });
});

const getCreatedByTeam = catchAsync(async (req: Request, res: Response) => {
  const { team_id } = req.params;
  const events = await Service.getCreatedByTeam(team_id,req.query);
  res.status(200).json({ success: true,message: "Retrived all events successfully", data: events });
});
const getCreatedByOpponent = catchAsync(async (req: Request, res: Response) => {
  const { team_id } = req.params;
  console.log("Opponent: ", team_id);
  const events = await Service.getCreatedByOpponent(team_id,req.query);
  res.status(200).json({ success: true,message: "Retrived all events successfully", data: events });
});

const getTotalEventsOfTeam = catchAsync(async (req: Request, res: Response) => {
  const { team_id } = req.params;
  const events = await Service.getTotalEventsOfTeam(team_id,req.query);
  res.status(200).json({ success: true,message: "Retrived all events successfully", data: events });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const {items,paginationData} = await Service.getAll(req.query);
  res.status(200).json({ success: true,message: "Retrived all events successfully", data: items, pagination: paginationData });
});
const getAllByAdmin = catchAsync(async (req: Request, res: Response) => {
  const admin_id = req.user._id;
  console.log("Admin_id : ", admin_id);
  const {items,paginationData} = await Service.getAllByAdmin(admin_id,req.query);
  res.status(200).json({ success: true,message: "Retrived all events successfully by Admin", data: items, pagination: paginationData });
});

export const Controller = {create,getCreatedByTeam,getCreatedByOpponent,getTotalEventsOfTeam,getById,update,remove,getAll,getAllByAdmin }