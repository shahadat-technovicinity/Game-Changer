"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
const model_2 = require("../users/model");
const appError_1 = require("../utils/appError");
const create = async (data) => {
    const team = new model_1.Team(data);
    await model_2.User.findByIdAndUpdate(data?.admin_id, {
        $addToSet: { admin_teams: team._id },
    });
    return await team.save();
};
const update = async (id, data) => {
    return await model_1.Team.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};
const getAll = async (query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const [items, totalItems] = await Promise.all([
        model_1.Team.find(finalQuery)
            .populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type', 'players_id'])
            .sort(sortQuery)
            .skip(skip)
            .limit(limit),
        model_1.Team.countDocuments(finalQuery),
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
    return await model_1.Team.findById(id).populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type', 'players_id']);
};
const addPlayer = async (id, data) => {
    const player = await model_2.User.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        team_id: id
    });
    const updatedTeam = await model_1.Team.findByIdAndUpdate(id, { $addToSet: { players_id: player._id } }, // Prevents duplicates
    { new: true } // Returns updated document
    )
        .populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type'])
        .populate('players_id', 'first_name last_name email image role team_id');
    return updatedTeam;
};
const removePlayer = async (id, player_id) => {
    await model_2.User.findByIdAndUpdate(player_id, { team_id: null }, { new: true });
    const updatedTeam = await model_1.Team.findByIdAndUpdate(id, { $pull: { players_id: player_id } }, // Removes playerId from array
    { new: true } // Returns updated document
    )
        .populate(['admin_id', 'game_type', 'team_type', 'age_type', 'season_type'])
        .populate('players_id', 'first_name last_name email image role');
    return updatedTeam;
};
const remove = async (id) => {
    return await model_1.Team.findByIdAndDelete(id);
};
const getPlayers = async (teamId, query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const filter = { _id: teamId, ...finalQuery };
    const teams = await model_1.Team.find(filter).lean();
    const team = teams[0];
    if (!team)
        throw new appError_1.AppError("Team not found", 404);
    const totalPlayers = team?.players_id.length;
    // Step 2: Paginate players manually using players_id
    const paginatedPlayerIds = team.players_id.slice(skip, skip + limit);
    // Step 3: Fetch user details
    const players = await model_2.User.find({ _id: { $in: paginatedPlayerIds } });
    return {
        players,
        pagination: {
            totalItems: totalPlayers,
            totalPages: Math.ceil(totalPlayers / limit),
            currentPage: page,
            limit
        }
    };
};
exports.Service = { create, update, getAll, getById, addPlayer, removePlayer, getPlayers, remove };
