"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const queryHelper_1 = require("../utils/queryHelper");
const model_1 = require("./model");
const create = async (data) => {
    const event = await model_1.Event.create(data);
    return await event.populate(['admin_id', 'team_id', 'opponent_team_id']);
};
const getById = async (eventId) => {
    return await model_1.Event.findById(eventId).populate(['admin_id', 'team_id', 'opponent_team_id']);
    ;
};
const update = async (eventId, data) => {
    return await model_1.Event.findByIdAndUpdate(eventId, data, { new: true }).populate(['admin_id', 'team_id', 'opponent_team_id']);
};
const remove = async (eventId) => {
    return await model_1.Event.findByIdAndDelete(eventId);
};
const getCreatedByTeam = async (teamId, query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const filter = { team_id: teamId, ...finalQuery };
    const [items, totalItems] = await Promise.all([
        model_1.Event.find(filter)
            .populate(['admin_id', 'team_id', 'opponent_team_id'])
            .sort(sortQuery)
            .skip(skip)
            .limit(limit),
        model_1.Event.countDocuments(filter),
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
const getCreatedByOpponent = async (teamId, query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const filter = { opponet_team_id: teamId, ...finalQuery };
    const [items, totalItems] = await Promise.all([
        model_1.Event.find(filter)
            .populate(['admin_id', 'team_id', 'opponent_team_id'])
            .sort(sortQuery)
            .skip(skip)
            .limit(limit),
        model_1.Event.countDocuments(filter),
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
const getTotalEventsOfTeam = async (teamId, query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const filter = {
        $or: [
            { team_id: teamId },
            { opponent_team_id: teamId }
        ],
        ...finalQuery,
    };
    const [items, totalItems] = await Promise.all([
        model_1.Event.find(filter)
            .populate(['admin_id', 'team_id', 'opponent_team_id'])
            .sort(sortQuery)
            .skip(skip)
            .limit(limit),
        model_1.Event.countDocuments(filter),
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
const getAll = async (query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const [items, totalItems] = await Promise.all([
        model_1.Event.find(finalQuery)
            .populate(['admin_id', 'team_id', 'opponent_team_id'])
            .sort(sortQuery)
            .skip(skip)
            .limit(limit),
        model_1.Event.countDocuments(finalQuery),
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
const getAllByAdmin = async (admin_id, query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    console.log("Admin_id in service: ", admin_id);
    const filter = { admin_id, ...finalQuery };
    const [items, totalItems] = await Promise.all([
        model_1.Event.find(filter)
            .populate(['admin_id', 'team_id', 'opponent_team_id'])
            .sort(sortQuery)
            .skip(skip)
            .limit(limit),
        model_1.Event.countDocuments(filter),
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
exports.Service = { create, getCreatedByTeam, getCreatedByOpponent, getTotalEventsOfTeam, getById, update, remove, getAll, getAllByAdmin };
