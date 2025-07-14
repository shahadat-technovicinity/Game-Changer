"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
const create = async (data) => {
    const ageType = new model_1.AgeType(data);
    return await ageType.save();
};
const getAll = async (query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const [items, totalItems] = await Promise.all([
        model_1.AgeType.find(finalQuery).sort(sortQuery).skip(skip).limit(limit),
        model_1.AgeType.countDocuments(finalQuery),
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
    return await model_1.AgeType.findById(id).lean();
};
const update = async (id, data) => {
    return await model_1.AgeType.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};
const remove = async (id) => {
    return await model_1.AgeType.findByIdAndDelete(id);
};
exports.Service = { create, getAll, getById, update, remove };
