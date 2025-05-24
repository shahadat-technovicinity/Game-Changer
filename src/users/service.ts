import { User, IUser } from "./model";
import { queryHelper } from "../utils/queryHelper";


const getAll = async (query: any): Promise<{ items: IUser[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const [items, totalItems] = await Promise.all([
    User.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
    User.countDocuments(finalQuery),
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

const getById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).lean();
};


const update = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};


export const Service = {getAll,getById,update};