"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
const create = async (data) => {
    const seasonType = new model_1.SeasonType(data);
    return await seasonType.save();
};
const getAll = async (query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const [items, totalItems] = await Promise.all([
        model_1.SeasonType.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
        model_1.SeasonType.countDocuments(finalQuery),
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
    return await model_1.SeasonType.findById(id).lean();
};
const update = async (id, data) => {
    return await model_1.SeasonType.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};
const remove = async (id) => {
    return await model_1.SeasonType.findByIdAndDelete(id);
};
exports.Service = { create, getAll, getById, update, remove };
