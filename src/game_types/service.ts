import { GameType, IGameType } from "./model";
import { queryHelper } from "../utils/queryHelper";

const create = async (data: Partial<IGameType>): Promise<IGameType> => {
  const gameType = new GameType(data);
  return await gameType.save();
};

const getAll = async (query: any): Promise<{ items: IGameType[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    GameType.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
    GameType.countDocuments(finalQuery),
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

const getById = async (id: string): Promise<IGameType | null> => {
  return await GameType.findById(id).lean();
};


const update = async (
  id: string,
  data: Partial<IGameType>
): Promise<IGameType | null> => {
  return await GameType.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const remove = async (id: string): Promise<IGameType | null> => {
  return await GameType.findByIdAndDelete(id);
};

export const Service = {create,getAll,getById,update,remove};