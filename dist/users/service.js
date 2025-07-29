"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
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
const getAll = async (query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
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
        model_1.User.aggregate([
            ...basePipeline,
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit }
        ]),
        model_1.User.aggregate([
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
const getById = async (id) => {
    return await model_1.User.findById(id);
};
const update = async (id, data) => {
    return await model_1.User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};
exports.Service = { getAll, getById, update };
