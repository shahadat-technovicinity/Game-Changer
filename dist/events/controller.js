"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const service_1 = require("./service");
const catchAsync_1 = require("../utils/catchAsync");
const appError_1 = require("../utils/appError");
const uploadCloudinary_1 = require("../utils/uploadCloudinary");
const create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const admin_id = req.user._id;
    const { notes, location, repeats, all_day, arrive_time, duration, start_date, event_type, opponent_team_id, team_id, home_away } = req.body;
    if (!notes || !location || !repeats || !all_day || !arrive_time || !duration || !start_date || !event_type || !opponent_team_id || !team_id || !home_away) {
        throw new appError_1.AppError("Required fields are missing", 400);
    }
    let imageUrl = "";
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        imageUrl = uploadResult.secure_url;
    }
    const payload = {
        admin_id,
        notes,
        location,
        repeats,
        all_day,
        arrive_time,
        duration,
        start_date,
        event_type,
        opponent_team_id,
        team_id,
        home_away,
        image: imageUrl
    };
    const item = await service_1.Service.create(payload);
    res.status(201).json({
        success: true,
        message: "Event is created successfully",
        data: item,
    });
});
const getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const event = await service_1.Service.getById(id);
    if (!event) {
        return res.status(404).json({ success: false, message: "Event is not found" });
    }
    res.status(200).json({ success: true, message: "Event is retrived successfully", data: event });
});
const update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { notes, location, repeats, all_day, arrive_time, duration, start_date, event_type, opponent_team_id, team_id, home_away } = req.body;
    if (!notes && !location && !repeats && !all_day && !arrive_time && !duration && !start_date && !event_type && !opponent_team_id && !team_id && !home_away) {
        throw new appError_1.AppError("Required fields are missing", 400);
    }
    let imageUrl = "";
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        imageUrl = uploadResult.secure_url;
    }
    const payload = {};
    if (notes)
        payload.notes = notes;
    if (location)
        payload.location = location;
    if (repeats)
        payload.repeats = repeats;
    if (all_day)
        payload.all_day = all_day;
    if (arrive_time)
        payload.arrive_time = arrive_time;
    if (duration)
        payload.duration = duration;
    if (start_date)
        payload.start_date = start_date;
    if (event_type)
        payload.event_type = event_type;
    if (opponent_team_id)
        payload.opponent_team_id = opponent_team_id;
    if (team_id)
        payload.team_id = team_id;
    if (opponent_team_id)
        payload.opponent_team_id = opponent_team_id;
    if (home_away)
        payload.home_away = home_away;
    if (imageUrl)
        payload.image = imageUrl;
    const updated = await service_1.Service.update(id, payload);
    res.status(200).json({ success: true, message: 'Event is updated', data: updated });
});
const remove = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const item = await service_1.Service.remove(req.params.id);
    if (!item) {
        return res.status(404).json({ success: false, message: "Event is not found" });
    }
    res.status(200).json({ success: true, message: "Event is deleted" });
});
const getCreatedByTeam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { team_id } = req.params;
    const events = await service_1.Service.getCreatedByTeam(team_id, req.query);
    res.status(200).json({ success: true, message: "Retrived all events successfully", data: events });
});
const getCreatedByOpponent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { team_id } = req.params;
    const events = await service_1.Service.getCreatedByOpponent(team_id, req.query);
    res.status(200).json({ success: true, message: "Retrived all events successfully", data: events });
});
const getTotalEventsOfTeam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { team_id } = req.params;
    const events = await service_1.Service.getTotalEventsOfTeam(team_id, req.query);
    res.status(200).json({ success: true, message: "Retrived all events successfully", data: events });
});
const getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { items, paginationData } = await service_1.Service.getAll(req.query);
    res.status(200).json({ success: true, message: "Retrived all events successfully", data: items, pagination: paginationData });
});
exports.Controller = { create, getCreatedByTeam, getCreatedByOpponent, getTotalEventsOfTeam, getById, update, remove, getAll };
