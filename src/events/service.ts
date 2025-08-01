import { queryHelper } from '../utils/queryHelper';
import { Event, IEvent } from './model';

const create = async (data: Partial<IEvent>) => {
  const event = await Event.create(data);
  return await event.populate(['admin_id', 'team_id', 'opponent_team_id']);
};

const getById = async (eventId: string) => {
  return await Event.findById(eventId).populate(['admin_id', 'team_id', 'opponent_team_id']);;
};

const update = async (eventId: string, data: Partial<IEvent>) => {
  return await Event.findByIdAndUpdate(eventId, data, { new: true }).populate(['admin_id', 'team_id', 'opponent_team_id']);
};
const liveToggle = async (eventId: string, data: Partial<IEvent>) => {
  return await Event.findByIdAndUpdate(eventId, data, { new: true }).populate(['admin_id', 'team_id', 'opponent_team_id']);
};

const remove = async (eventId: string) => {
  return await Event.findByIdAndDelete(eventId);
};

const getCreatedByTeam = async (teamId: string,query: any) : Promise<{ items: IEvent[]; paginationData: any }> => {
    const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);
    const filter = {team_id:teamId, ...finalQuery};
    const [items, totalItems] = await Promise.all([
    Event.find(filter)
        .populate(['admin_id', 'team_id', 'opponent_team_id'])
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
    Event.countDocuments(filter),
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

const getCreatedByOpponent = async (teamId: string,query: any) : Promise<{ items: IEvent[]; paginationData: any }> => {
    const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);
    const filter = {opponent_team_id:teamId, ...finalQuery};
    console.log("Opponent in service: ", teamId);
    const [items, totalItems] = await Promise.all([
    Event.find(filter)
        .populate(['admin_id', 'team_id', 'opponent_team_id'])
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
    Event.countDocuments(filter),
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

const getTotalEventsOfTeam = async (teamId: string,query: any) : Promise<{ items: IEvent[]; paginationData: any }> => {
    const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);
     const filter = {
        $or: [
        { team_id: teamId },
        { opponent_team_id: teamId }
        ],
        ...finalQuery,
    };
    const [items, totalItems] = await Promise.all([
    Event.find(filter)
        .populate(['admin_id', 'team_id', 'opponent_team_id'])
        .sort(sortQuery)
        .skip(skip)
        .limit(limit),
    Event.countDocuments(filter),
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

const getAll = async (query: any): Promise<{ items: IEvent[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    Event.find(finalQuery)
      .populate(['admin_id', 'team_id', 'opponent_team_id'])
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),
    Event.countDocuments(finalQuery),
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

const getAllLive = async (query: any): Promise<{ items: IEvent[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);
  const filter = { is_live: true, ...finalQuery };
  const [items, totalItems] = await Promise.all([
    Event.find(filter)
      .populate(['admin_id', 'team_id', 'opponent_team_id'])
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),
    Event.countDocuments(filter),
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

const getAllByAdmin = async (admin_id: string,query: any): Promise<{ items: IEvent[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);
  console.log("Admin_id in service: ", admin_id);
  const filter = {admin_id,...finalQuery};
  const [items, totalItems] = await Promise.all([
    Event.find(filter)
      .populate(['admin_id', 'team_id', 'opponent_team_id'])
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),
    Event.countDocuments(filter),
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

const uploadVideo = async (eventId: string, videoUrl: string) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  if (!event.uploaded_videos) {
    event.uploaded_videos = [];
  }
  event.uploaded_videos.push(videoUrl);
  await event.save();
  return event;
};

export const Service = {create,uploadVideo, getCreatedByTeam,getCreatedByOpponent,getTotalEventsOfTeam,liveToggle,getAllLive ,getById, update,remove,getAll,getAllByAdmin};