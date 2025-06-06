"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const service_1 = require("./service");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const uploadCloudinary_1 = require("../utils/uploadCloudinary");
const model_1 = require("../users/model");
const create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const admin_id = req.user._id;
    const { season_type, team_name, team_place, age_type, team_type, game_type } = req.body;
    if (!season_type && !team_name && !team_place && !age_type && !team_type && !game_type) {
        throw new appError_1.AppError("Required fields are missing", 400);
    }
    let imageUrl = "";
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        imageUrl = uploadResult.secure_url;
    }
    const payload = {
        admin_id,
        season_type,
        team_name,
        team_place,
        age_type,
        team_type,
        game_type,
        image: imageUrl
    };
    const item = await service_1.Service.create(payload);
    res.status(201).json({
        success: true,
        message: "Team is created successfully",
        data: item,
    });
});
const update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { season_type, team_name, team_place, age_type, team_type, game_type, players_id } = req.body;
    if (!season_type && !team_name && !team_place && !age_type && !team_type && !game_type && !players_id && !req.file) {
        throw new appError_1.AppError("At least one field must be provided", 400);
    }
    const payload = {};
    if (season_type)
        payload.season_type = season_type;
    if (team_name)
        payload.team_name = team_name;
    if (team_place)
        payload.team_place = team_place;
    if (age_type)
        payload.age_type = age_type;
    if (team_type)
        payload.team_type = team_type;
    if (game_type)
        payload.game_type = game_type;
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        payload.image = uploadResult.secure_url;
    }
    const item = await service_1.Service.update(id, payload);
    if (!item) {
        throw new appError_1.AppError("Team type not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Team is updated successfully",
        data: item,
    });
});
const getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { items, paginationData } = await service_1.Service.getAll(req.query);
    res.status(200).json({ success: true, message: "Retrived all teams successfully", data: items, pagination: paginationData });
});
const getPlayers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { players, pagination } = await service_1.Service.getPlayers(id, req.query);
    res.status(200).json({ success: true, message: "Retrived all players of team successfully", data: players, pagination });
});
const getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const team = await service_1.Service.getById(req.params.id);
    res.status(200).json({ success: true, message: "Team is retrived successfully", data: team });
});
const addPlayer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;
    if (!first_name || !email || !last_name) {
        throw new appError_1.AppError('Required fields are missing', 400);
    }
    const payload = {
        first_name,
        last_name,
        email,
        role: model_1.UserRole.PLAYER
    };
    const team = await service_1.Service.addPlayer(id, payload);
    res.status(200).json({ success: true, message: "Player added to the team successfully", data: team });
    // TODO: Send Email
});
const removePlayer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { player_id } = req.params;
    const team = await service_1.Service.removePlayer(id, player_id);
    res.status(200).json({ success: true, message: "Player removed from the team successfully", data: team });
});
const remove = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const item = await service_1.Service.remove(req.params.id);
    if (!item) {
        return res.status(404).json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, message: "Team deleted" });
});
exports.Controller = { create, update, getById, getAll, addPlayer, removePlayer, getPlayers, remove };
