import { SeasonType, ISeasonType } from "./model";
import { queryHelper } from "../utils/queryHelper";

const create = async (data: Partial<ISeasonType>): Promise<ISeasonType> => {
  const seasonType = new SeasonType(data);
  return await seasonType.save();
};

const getAll = async (query: any): Promise<{ items: ISeasonType[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    SeasonType.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
    SeasonType.countDocuments(finalQuery),
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

const getById = async (id: string): Promise<ISeasonType | null> => {
  return await SeasonType.findById(id).lean();
};


const update = async (
  id: string,
  data: Partial<ISeasonType>
): Promise<ISeasonType | null> => {
  return await SeasonType.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const remove = async (id: string): Promise<ISeasonType | null> => {
  return await SeasonType.findByIdAndDelete(id);
};

export const Service = {create,getAll,getById,update,remove};