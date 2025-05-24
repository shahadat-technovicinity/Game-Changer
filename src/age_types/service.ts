import { AgeType, IAgeType } from "./model";
import { queryHelper } from "../utils/queryHelper";

const create = async (data: Partial<IAgeType>): Promise<IAgeType> => {
  const ageType = new AgeType(data);
  return await ageType.save();
};

const getAll = async (query: any): Promise<{ items: IAgeType[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    AgeType.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
    AgeType.countDocuments(finalQuery),
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

const getById = async (id: string): Promise<IAgeType | null> => {
  return await AgeType.findById(id).lean();
};


const update = async (
  id: string,
  data: Partial<IAgeType>
): Promise<IAgeType | null> => {
  return await AgeType.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const remove = async (id: string): Promise<IAgeType | null> => {
  return await AgeType.findByIdAndDelete(id);
};

export const Service = {create,getAll,getById,update,remove};