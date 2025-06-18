"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
const getAll = async (query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const [items, totalItems] = await Promise.all([
        model_1.User.find(finalQuery).sort(sortQuery).skip(skip).limit(limit).select('-access_token -refresh_token -forget_password_code_time -forget_password_code'),
        model_1.User.countDocuments(finalQuery),
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
