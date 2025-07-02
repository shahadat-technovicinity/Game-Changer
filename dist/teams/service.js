"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const model_1 = require("./model");
const queryHelper_1 = require("../utils/queryHelper");
const model_2 = require("../users/model");
const appError_1 = require("../utils/appError");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ejs_1 = __importDefault(require("ejs"));
const emailService_1 = require("../utils/emailService");
const mongoose_1 = __importDefault(require("mongoose"));
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
const addPlayer = async (teamId, data) => {
    // Try to find the player by email
    let player = await model_2.User.findOne({ email: data.email });
    let temp_password;
    if (player) {
        // Update existing player's info
        player.first_name = data.first_name ?? player.first_name;
        player.last_name = data.last_name ?? player.last_name;
        player.role = data.role ?? player.role;
        player.team_id = new mongoose_1.default.Types.ObjectId(teamId);
        await player.save();
    }
    else {
        // Create new player
        temp_password = Math.floor(100000 + Math.random() * 900000).toString();
        player = await model_2.User.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
            team_id: teamId,
            password: temp_password
        });
    }
    // Update team with player if not already added
    const updatedTeam = await model_1.Team.findByIdAndUpdate(teamId, { $addToSet: { players_id: player._id } }, // Avoid duplicates
    { new: true })
        .populate([
        { path: 'admin_id', select: 'first_name last_name email image' },
        'game_type',
        'team_type',
        'age_type',
        'season_type'
    ])
        .populate('players_id', 'first_name last_name email image role team_id');
    // Send Invitation Email
    const subject = `You're Invited to Join ${updatedTeam?.team_name} on Game Changer!`;
    let mailContent;
    console.log("Temp Password: ", temp_password);
    if (temp_password) {
        const emailTemplatePath = path_1.default.resolve(__dirname, "..", "email_templates", "player_add_email.ejs");
        const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
        mailContent = ejs_1.default.render(emailTemplate, {
            name: `${player.first_name} ${player.last_name}`,
            email: player.email,
            team: updatedTeam?.team_name,
            password: temp_password,
        });
    }
    else {
        const emailTemplatePath = path_1.default.resolve(__dirname, "..", "email_templates", "player_add_email_without_pass.ejs");
        const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
        mailContent = ejs_1.default.render(emailTemplate, {
            name: `${player.first_name} ${player.last_name}`,
            email: player.email,
            team: updatedTeam?.team_name
        });
    }
    (0, emailService_1.sendEmail)(player.email, subject, mailContent);
    return updatedTeam;
};
const addCoach = async (teamId, data) => {
    // Try to find the player by email
    let player = await model_2.User.findOne({ email: data.email });
    let temp_password;
    if (player) {
        // Update existing player's info
        player.first_name = data.first_name ?? player.first_name;
        player.last_name = data.last_name ?? player.last_name;
        player.role = data.role ?? player.role;
        player.team_id = new mongoose_1.default.Types.ObjectId(teamId);
        await player.save();
    }
    else {
        // Create new player
        temp_password = Math.floor(100000 + Math.random() * 900000).toString();
        player = await model_2.User.create({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            role: data.role,
            team_id: teamId,
            password: temp_password
        });
    }
    // Update team with player if not already added
    const updatedTeam = await model_1.Team.findByIdAndUpdate(teamId, { $addToSet: { coaches_id: player._id } }, // Avoid duplicates
    { new: true })
        .populate([
        { path: 'admin_id', select: 'first_name last_name email image' },
        'game_type',
        'team_type',
        'age_type',
        'season_type'
    ])
        .populate('coaches_id', 'first_name last_name email image role team_id');
    // Send Invitation Email
    const subject = `You're Invited to Join ${updatedTeam?.team_name} on Game Changer!`;
    let mailContent;
    console.log("Temp Password: ", temp_password);
    if (temp_password) {
        const emailTemplatePath = path_1.default.resolve(__dirname, "..", "email_templates", "player_add_email.ejs");
        const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
        mailContent = ejs_1.default.render(emailTemplate, {
            name: `${player.first_name} ${player.last_name}`,
            email: player.email,
            team: updatedTeam?.team_name,
            password: temp_password,
        });
    }
    else {
        const emailTemplatePath = path_1.default.resolve(__dirname, "..", "email_templates", "player_add_email_without_pass.ejs");
        const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, "utf-8");
        mailContent = ejs_1.default.render(emailTemplate, {
            name: `${player.first_name} ${player.last_name}`,
            email: player.email,
            team: updatedTeam?.team_name
        });
    }
    (0, emailService_1.sendEmail)(player.email, subject, mailContent);
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
const getCoachs = async (teamId, query) => {
    const { skip, limit, finalQuery, sortQuery, page } = (0, queryHelper_1.queryHelper)(query);
    const filter = { _id: teamId, ...finalQuery };
    const teams = await model_1.Team.find(filter).lean();
    const team = teams[0];
    if (!team)
        throw new appError_1.AppError("Team not found", 404);
    const totalPlayers = team?.coaches_id?.length;
    // Step 2: Paginate coaches manually using coaches_id
    const paginatedPlayerIds = team.coaches_id?.slice(skip, skip + limit);
    // Step 3: Fetch user details
    const coaches = await model_2.User.find({ _id: { $in: paginatedPlayerIds } });
    return {
        coaches,
        pagination: {
            totalItems: totalPlayers,
            totalPages: Math.ceil(totalPlayers / limit),
            currentPage: page,
            limit
        }
    };
};
exports.Service = { create, update, getAll, getById, addPlayer, addCoach, getCoachs, removePlayer, getPlayers, remove };
