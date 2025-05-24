import { TeamType, ITeamType } from "./model";
import { queryHelper } from "../utils/queryHelper";

const create = async (data: Partial<ITeamType>): Promise<ITeamType> => {
  const teamType = new TeamType(data);
  return await teamType.save();
};

const getAll = async (query: any): Promise<{ items: ITeamType[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    TeamType.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
    TeamType.countDocuments(finalQuery),
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

const getById = async (id: string): Promise<ITeamType | null> => {
  return await TeamType.findById(id).lean();
};


const update = async (
  id: string,
  data: Partial<ITeamType>
): Promise<ITeamType | null> => {
  return await TeamType.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const remove = async (id: string): Promise<ITeamType | null> => {
  return await TeamType.findByIdAndDelete(id);
};

export const Service = {create,getAll,getById,update,remove};