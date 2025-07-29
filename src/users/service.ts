import { User, IUser } from "./model";
import { queryHelper } from "../utils/queryHelper";


// const getAll = async (query: any): Promise<{ items: IUser[]; paginationData: any }> => {
//   const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

//   const [items, totalItems] = await Promise.all([
//     User.find(finalQuery).sort(sortQuery).skip(skip).limit(limit).select('-access_token -refresh_token -forget_password_code_time -forget_password_code'),
//     User.countDocuments(finalQuery),
//   ]);
//   const totalPages = Math.ceil(totalItems / limit);
//   const paginationData = {
//     totalItems,
//     totalPages,
//     currentPage: page,
//     limit,
//   };
//   return { items, paginationData };
// };

const getAll = async (query: any): Promise<{ items: IUser[]; paginationData: any }> => {
  const { skip, limit, finalQuery, sortQuery, page } = queryHelper(query);

  const basePipeline = [
    {
      $lookup: {
        from: "teams", // ✅ MongoDB collection name
        localField: "team_id",
        foreignField: "_id",
        as: "team"
      }
    },
    {
      $unwind: {
        path: "$team",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "teams", // ✅ MongoDB collection name
        localField: "admin_teams",
        foreignField: "_id",
        as: "adminTeams"
      }
    },
    {
      $match: finalQuery
    },
    {
      $project: {
        access_token: 0,
        refresh_token: 0,
        forget_password_code: 0,
        forget_password_code_time: 0
      }
    }
  ];

  const [items, totalItemsData] = await Promise.all([
    User.aggregate([
      ...basePipeline,
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit }
    ]),
    User.aggregate([
      ...basePipeline,
      { $count: "count" }
    ])
  ]);

  const totalItems = totalItemsData[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const paginationData = {
    totalItems,
    totalPages,
    currentPage: page,
    limit
  };

  return { items, paginationData };
};

const getById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
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