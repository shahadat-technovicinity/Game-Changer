"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const service_1 = require("./service");
const uploadCloudinary_1 = require("../utils/uploadCloudinary");
const appError_1 = require("../utils/appError");
const create = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        throw new appError_1.AppError("The 'title' field is required", 400);
    }
    let imageUrl = "";
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        imageUrl = uploadResult.secure_url;
    }
    const payload = {
        title,
        image: imageUrl,
    };
    const item = await service_1.Service.create(payload);
    res.status(201).json({
        success: true,
        message: "Game type created successfully",
        data: item,
    });
});
const getAll = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { items, paginationData } = await service_1.Service.getAll(req.query);
    res.status(200).json({ success: true, message: "Retrived all game types successfully", data: items, pagination: paginationData });
});
const getById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const item = await service_1.Service.getById(id);
    if (!item) {
        return res.status(404).json({ success: false, message: "Game type not found" });
    }
    return res.status(200).json({
        success: true,
        message: "Game type retrieved successfully",
        data: item,
    });
});
const update = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { title } = req.body;
    const { id } = req.params;
    // Validate required fields
    if (!title && !req.file) {
        throw new appError_1.AppError("At least one field (title or image) must be provided", 400);
    }
    const payload = {};
    if (title)
        payload.title = title;
    if (req.file) {
        const uploadResult = await (0, uploadCloudinary_1.UploadCloudinary)(req.file);
        payload.image = uploadResult.secure_url;
    }
    const item = await service_1.Service.update(id, payload);
    if (!item) {
        throw new appError_1.AppError("Game type not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Game type updated successfully",
        data: item,
    });
});
const remove = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const item = await service_1.Service.remove(req.params.id);
    if (!item) {
        return res.status(404).json({ success: false, message: "Game type not found" });
    }
    res.status(200).json({ success: true, message: "Game type deleted" });
});
exports.Controller = { create, getAll, getById, update, remove };
